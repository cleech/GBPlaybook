import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  DialogContent,
  Button,
  TextField,
  StepContent,
  TextareaAutosize,
  Typography,
  ButtonGroup,
} from "@mui/material";
import { Auth, signInAnonymously, signOut } from "firebase/auth";
import { useAuth, useFirestore, useSigninCheck } from "reactfire";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  query,
  onSnapshot,
  updateDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { iceConfig, RTCProvider, useRTC } from "../services/webrtc";

interface LobbyStepState {
  name: string;
  pc?: RTCPeerConnection;
}

interface LobbyStepProps {
  state: LobbyStepState;
  setState: React.Dispatch<React.SetStateAction<LobbyStepState>>;
  onComplete: () => void;
}

const LobbyLogin = (props: LobbyStepProps) => {
  const auth = useAuth();
  const db = useFirestore();
  const { pc: peer, newPc, setDc } = useRTC();

  const enterLobby = async (name: string) => {
    // let pc = peer ?? newPc();
    if (peer) {
      console.log("closing");
      peer.close();
    }
    let pc = newPc();
    let dc = pc.createDataChannel("dataSync", { negotiated: true, id: 27 });
    dc.addEventListener("open", (event) => {
      setDc(dc);
    });
    dc.addEventListener("close", (event) => {
      setDc(undefined);
    });
    // pc.onnegotiationneeded = (ev) => {
    return Promise.all([signInAnonymously(auth), pc.createOffer()]).then(
      ([_user, offer]) => {
        pc.onicecandidate = ({ candidate }) => {
          if (candidate) {
            addDoc(
              collection(db, "lobby", name, "iceCandidates"),
              candidate.toJSON()
            );
          }
        };
        return Promise.all([
          setDoc(doc(db, "lobby", name), {
            name: name,
            sdp: offer.sdp,
            type: offer.type,
          }),
          pc.setLocalDescription(offer),
        ]);
      }
    );
    // };
  };
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        label="screen name"
        variant="outlined"
        value={props.state.name}
        onChange={(e) => {
          props.setState({ ...props.state, name: e.target.value });
        }}
      />
      <Button
        disabled={props.state.name === ""}
        onClick={async () => {
          await enterLobby(props.state.name);
          props?.onComplete();
        }}
      >
        next
      </Button>
    </Box>
  );
};

const LobbyList = (props: LobbyStepProps) => {
  const db = useFirestore();
  const { pc } = useRTC();
  const [users, setUsers] = useState<Array<string>>([]);
  const [q, setQ] = useState(query(collection(db, "lobby")));

  useEffect(() => {
    console.log("useEffect");

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log(
        `snapShot: ${querySnapshot.docs.map((doc) => doc.data().name)}`
      );
      const users: Array<string> = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data().name);
      });
      setUsers(users);
    });

    const unsubscribe2 = onSnapshot(
      doc(db, "lobby", props.state.name),
      (doc) => {
        if (!doc.data()?.answer) {
          return;
        }
        /* answer received from someone */
        pc?.setRemoteDescription({
          type: doc.data()?.answer.type,
          sdp: doc.data()?.answer.sdp,
        });
        getDocs(
          collection(db, "lobby", doc.data()?.answer.name, "iceCandidates")
        ).then((snapshot) => {
          snapshot.forEach((doc) => {
            pc?.addIceCandidate(doc.data());
          });
        });
      }
    );

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, [db, q, props.state.name]);

  const onUserClick = async (user: string) => {
    if (!pc) {
      throw new Error("no peer connection?");
    }
    const snap = await getDoc(doc(db, "lobby", user));
    const offer = snap.data() as RTCSessionDescriptionInit;
    if (offer) {
      pc.setRemoteDescription(offer);
    }
    await pc.createAnswer().then(async (answer) => {
      await pc.setLocalDescription(answer);
      await updateDoc(doc(db, "lobby", user), {
        answer: {
          name: props.state.name,
          sdp: answer.sdp,
          type: answer.type,
        },
      });
      await getDocs(collection(db, "lobby", user, "iceCandidates")).then(
        (snapshot) => {
          snapshot.forEach((doc) => {
            pc?.addIceCandidate(doc.data());
          });
        }
      );
    });
  };

  return (
    <Box>
      <ButtonGroup variant="text">
        {users.map((user, index) => (
          <Button
            key={user}
            onClick={(ev) => {
              onUserClick(user);
            }}
          >
            {user}
          </Button>
        ))}
      </ButtonGroup>
      <Button
        onClick={async () => {
          console.log(users);
          props?.onComplete();
        }}
      >
        next
      </Button>
    </Box>
  );
};

const LobbyStepper = (props: { onComplete?: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((step) => step + 1);
  };

  const handleFinish = () => {
    setActiveStep(0);
    props.onComplete?.();
  };

  const [state, setState] = useState({ name: "" });

  const lobbySteps = [
    {
      label: "login",
      element: (
        <LobbyLogin state={state} setState={setState} onComplete={handleNext} />
      ),
    },
    {
      label: "lobby",
      element: (
        <LobbyList state={state} setState={setState} onComplete={handleNext} />
      ),
    },
    { label: "connect", element: null },
  ];

  return (
    <Box>
      <Stepper activeStep={activeStep}>
        {lobbySteps.map(({ label, element }, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ m: 1 }}>
        {lobbySteps[activeStep].element}
        {/* {activeStep === lobbySteps.length - 1 ? (
          <Button onClick={handleFinish}>Finish</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )} */}
      </Box>
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
    <Dialog open={props.open} onClose={onClose}>
      <DialogTitle>Going Online</DialogTitle>
      <DialogContent>
        <LobbyStepper onComplete={onClose} />
      </DialogContent>
    </Dialog>
  );
};
export default Lobby;
