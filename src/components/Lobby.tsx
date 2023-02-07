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
  collection,
  doc,
  setDoc,
  query,
  onSnapshot,
  updateDoc,
  getDoc,
  arrayUnion,
  where,
  deleteDoc,
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
  // const auth = useAuth();
  const db = useFirestore();
  const { pc } = useRTC();
  const { state, setState, onComplete } = props;
  const { initiator, gid, uid } = state;

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
    console.log("start listening to firebase for players");
    const queryUnsubscribe = onSnapshot(
      query(collection(db, "lobby", gid, "players"), where("uid", "!=", uid)),
      (snapshot) => {
        snapshot.forEach((doc) => {
          pc?.setRemoteDescription(JSON.parse(doc.data()?.answer)).then(() => {
            setState((state) => ({ ...state, oid: doc.data()?.oid }));
          });
        });
      }
    );
    return () => {
      console.log("stop listening to firebase for players");
      queryUnsubscribe();
    };
  }, [onComplete, pc, db, gid, uid]);

  return (
    <Box>
      <Typography variant="h2">{state.gid}</Typography>
      <Typography variant="subtitle1">(waiting on opponent)</Typography>
    </Box>
  );
};

const LobbyConnectJoin = (props: LobbyStepProps) => {
  // const auth = useAuth();
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
  }, [onComplete, pc]);

  const joinGame = async (gid: string) => {
    await updateDoc(doc(db, "lobby", gid), { oid: oid });
    await getDoc(doc(db, "lobby", gid)).then(async (snapshot) => {
      const uid = snapshot.data()?.uid;
      await getDoc(doc(db, "lobby", gid, "players", uid)).then((snapshot) => {
        const offer = JSON.parse(snapshot.data()?.offer);
        pc.setRemoteDescription(offer);
        /// tell ice about remote iceCandidates
        snapshot.data()?.iceCandidates.forEach((candidate: string) => {
          pc.addIceCandidate(JSON.parse(candidate));
        });
      });
    });
    await pc.setLocalDescription();
    await setDoc(doc(db, "lobby", gid, "players", oid), {
      uid: oid,
      answer: JSON.stringify(pc.localDescription),
    });
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
      console.log(`cleanup: state: ${JSON.stringify(state)}`);
      if (state.uid) {
        deleteDoc(doc(db, "lobby", state.gid, "players", state.uid));
      }
      if (state.oid) {
        deleteDoc(doc(db, "lobby", state.gid, "players", state.oid));
      }
      deleteDoc(doc(db, "lobby", state.gid));
    }
    if (!state.initiator && state.gid) {
      console.log(`cleanup: state: ${JSON.stringify(state)}`);
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
            {/* <StepLabel>{label}</StepLabel> */}
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
      {/* <DialogTitle>Going Online</DialogTitle> */}
      <DialogContent>
        <LobbyStepper onComplete={onClose} />
      </DialogContent>
    </Dialog>
  );
};
export default Lobby;
