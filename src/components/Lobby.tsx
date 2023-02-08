import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  Stepper,
  Step,
  StepLabel,
  DialogContent,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { signInAnonymously } from "firebase/auth";
import { useAuth, useFirestore } from "reactfire";
import {
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
  getDoc,
  arrayUnion,
  deleteDoc,
  Unsubscribe,
} from "firebase/firestore";
import { useRTC } from "../services/webrtc";
import { FirebaseError } from "firebase/app";

interface LobbyStepState {
  // Game ID
  gid?: string;
  // User ID, from firebase authentication
  uid?: string;
  // Opponents ID, from firebase authentication
  oid?: string;
  // did I start the game, or am I joining?
  initiator?: boolean;
}

interface LobbyStepProps {
  state: LobbyStepState;
  setState: React.Dispatch<React.SetStateAction<LobbyStepState>>;
  onComplete: () => void;
}

const LobbyStart = (props: LobbyStepProps) => {
  const auth = useAuth();
  const db = useFirestore();
  const { newPc, setDc } = useRTC();

  const [pc, setPc] = useState<RTCPeerConnection | undefined>(undefined);

  useEffect(() => {
    const peer = newPc();
    setPc(peer);
    try {
      let dc = peer.createDataChannel("gameSync", { negotiated: true, id: 27 });
      dc.addEventListener("open", (event) => {
        setDc(dc);
      });
      dc.addEventListener("close", (event) => {
        setDc(undefined);
      });
    } catch (e) {
      console.log(e);
    }
  }, [setDc]); // why is newPc causing this to re-run?

  if (!pc) {
    return null;
  }

  const newGame = async () => {
    const {
      user: { uid },
    } = await signInAnonymously(auth);

    let gid = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

    let written = false;
    while (!written) {
      try {
        await setDoc(doc(db, "lobby", gid), {
          gid: gid,
          uid: uid,
        });
        written = true;
      } catch (e) {
        if (e instanceof FirebaseError && e.code === "permission-denied") {
          console.log(e);
          // gid conflict, pick a new one and try again
          gid = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0");
        } else {
          throw e;
        }
      }
    }

    props.setState((state) => ({
      ...state,
      gid: gid,
      uid: uid,
      initiator: true,
    }));

    /* FIXME batch these */
    pc.onicecandidate = async ({ candidate }) => {
      if (candidate) {
        await updateDoc(doc(db, "lobby", gid, "players", uid), {
          iceCandidates: arrayUnion(JSON.stringify(candidate)),
        });
      }
    };
    await pc.setLocalDescription();
    await setDoc(doc(db, "lobby", gid, "players", uid), {
      uid: uid,
      offer: JSON.stringify(pc.localDescription),
    });
  };

  const joinGame = async () => {
    const {
      user: { uid },
    } = await signInAnonymously(auth);
    props.setState((state) => ({ ...state, oid: uid, initiator: false }));
    await pc.setLocalDescription();
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Button
        onClick={async () => {
          await newGame();
          props?.onComplete();
        }}
      >
        Start a Game
      </Button>
      <Button
        onClick={async () => {
          await joinGame();
          props?.onComplete();
        }}
      >
        Join a Game
      </Button>
    </Box>
  );
};

const LobbyConnect = (props: LobbyStepProps) => {
  const { initiator } = props.state;
  if (initiator) {
    return <LobbyConnectWait {...props} />;
  } else {
    return <LobbyConnectJoin {...props} />;
  }
};

const LobbyConnectWait = (props: LobbyStepProps) => {
  const db = useFirestore();
  const { pc } = useRTC();
  const { state, setState, onComplete } = props;
  const { initiator, gid, uid } = state;
  const [oid, setOid] = useState<string | undefined>(undefined);

  if (!(!!pc && !!db && initiator && !!gid && !!uid)) {
    throw Error();
  }

  useEffect(() => {
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        pc.onconnectionstatechange = null;
        onComplete();
      }
    };
    let unsubscribe: Unsubscribe | undefined = undefined;
    if (!oid) {
      unsubscribe = onSnapshot(doc(db, "lobby", gid), (snapshot) => {
        let oid = snapshot.data()?.oid ?? undefined;
        setOid(oid);
      });
    } else if (!state.oid) {
      unsubscribe = onSnapshot(
        doc(db, "lobby", gid, "players", oid),
        async (docSnap) => {
          if (!docSnap.exists()) {
            return;
          }
          let answer = JSON.parse(docSnap.data().answer);
          await pc?.setRemoteDescription(answer).then(() => {
            setState((state) => ({ ...state, oid: oid }));
          });
          const iceCandidates = docSnap.data().iceCandidates;
          await iceCandidates?.forEach(async (candidate: string) => {
            await pc.addIceCandidate(JSON.parse(candidate));
          });
        }
      );
    } else if (pc.connectionState !== "connected") {
      unsubscribe = onSnapshot(
        doc(db, "lobby", gid, "players", oid),
        async (docSnap) => {
          if (!docSnap.exists()) {
            return;
          }
          const iceCandidates = docSnap.data().iceCandidates;
          await iceCandidates?.forEach(async (candidate: string) => {
            await pc.addIceCandidate(JSON.parse(candidate));
          });
        }
      );
    }

    return () => {
      // pc.onconnectionstatechange = null;
      unsubscribe?.();
    };
  }, [onComplete, setState, pc, db, gid, uid, oid, state.oid]);

  return (
    <Box>
      <Typography variant="h2">{state.gid}</Typography>
      <Typography variant="subtitle1">(waiting on opponent)</Typography>
    </Box>
  );
};

const LobbyConnectJoin = (props: LobbyStepProps) => {
  const db = useFirestore();
  const { pc } = useRTC();
  const { state, setState, onComplete } = props;
  const { oid, initiator } = state;

  if (!(!!pc && !!db && !initiator && !!oid)) {
    throw Error();
  }

  useEffect(() => {
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        pc.onconnectionstatechange = null;
        onComplete();
      }
    };
    return () => {
      // pc.onconnectionstatechange = null;
    };
  }, [onComplete, pc]);

  const joinGame = async (gid: string) => {
    const gameDocRef = doc(db, "lobby", gid);
    const oidRef = doc(db, "lobby", gid, "players", oid);
    let uid: string | undefined = undefined;

    try {
      // claiming write, once this is done we can access other documents
      await updateDoc(gameDocRef, { oid: oid });
      // read back game and player 1 info
      const gameDoc = await getDoc(gameDocRef);
      if (!gameDoc.exists()) {
        throw Error("Game ID does not exist");
      }
      uid = gameDoc.data().uid;
      if (!uid) {
        throw Error("Bad Game Document, no uid");
      }
      const uidRef = doc(db, "lobby", gid, "players", uid);
      const uidDoc = await getDoc(uidRef);
      if (!uidDoc.exists()) {
        throw Error("Player 1 offer not found");
      }
      const offer: RTCSessionDescriptionInit = JSON.parse(uidDoc.data().offer);
      // generate SDP answer and publish
      await pc.setRemoteDescription(offer);
      await pc.setLocalDescription();
      await setDoc(oidRef, {
        uid: oid,
        answer: JSON.stringify(pc.localDescription),
      });
      // tell ice about remote iceCandidates
      const iceCandidates = uidDoc.data().iceCandidates;
      iceCandidates.forEach((candidate: string) => {
        pc.addIceCandidate(JSON.parse(candidate));
      });
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Box>
      <TextField
        onChange={(ev) => {
          setState((state) => ({
            ...state,
            gid: ev.target.value.padStart(4, "0"),
          }));
        }}
      />
      <Button
        onClick={() => {
          if (props.state.gid) {
            joinGame(props.state.gid);
          }
        }}
      >
        Join
      </Button>
    </Box>
  );
};

const LobbyStepper = (props: { onComplete?: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState<LobbyStepState>({});
  const db = useFirestore();

  const handleNext = () => {
    setActiveStep((step) => step + 1);
  };

  const handleFinish = () => {
    // cleanup
    if (state.initiator && state.gid) {
      if (state.uid) {
        deleteDoc(doc(db, "lobby", state.gid, "players", state.uid));
      }
      deleteDoc(doc(db, "lobby", state.gid));
    }
    if (!state.initiator && state.gid) {
      if (state.oid) {
        deleteDoc(doc(db, "lobby", state.gid, "players", state.oid));
      }
    }
    props.onComplete?.();
  };

  const lobbySteps = [
    {
      label: "start",
      element: (
        <LobbyStart state={state} setState={setState} onComplete={handleNext} />
      ),
    },
    {
      label: "connect",
      element: (
        <LobbyConnect
          state={state}
          setState={setState}
          onComplete={handleFinish}
        />
      ),
    },
  ];

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {lobbySteps.map(({ label }) => (
          <Step key={label}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <Box sx={{ m: 1 }}>{lobbySteps[activeStep].element}</Box>
    </Box>
  );
};

interface LobbyProps {
  open: boolean;
  onClose?: () => void;
}

const Lobby = (props: LobbyProps) => {
  const { open, onClose } = props;
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <LobbyStepper onComplete={onClose} />
      </DialogContent>
    </Dialog>
  );
};
export default Lobby;
