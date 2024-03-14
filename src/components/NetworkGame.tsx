import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Sync } from "@mui/icons-material";
import { useData } from "../hooks/useData";
import { GBDatabase, GBGameState, gbdbBeginReplication } from "../models/gbdb";
import {
  RxWebRTCReplicationPool,
  SimplePeer,
} from "rxdb/plugins/replication-webrtc";
import * as uuid from "uuid";
import {
  HandshakeInitMessage,
  HandshakeMessage,
  HandshakeIDs,
  HandshakeJoinMessage,
} from "./netHandshake";
import { useNetworkState } from "../hooks/useNetworkState";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { firstValueFrom, map } from "rxjs";

const signalingServerUrl =
  import.meta.env.VITE_SIGNALING_URL ??
  "wss://gbplaybook-webrtc-server.onrender.com";

let replicationState:
  | RxWebRTCReplicationPool<GBGameState, SimplePeer>
  | undefined = undefined;

function clearGameStateCollection(db: GBDatabase) {
  return db.game_state
    .find()
    .exec()
    .then((docs) => db.game_state.bulkRemove(docs.map((d) => d._id)))
    .catch(console.error);
}

// only allow one async update to the replication state at a time
let replicationStateChangeInProgress = false;

function repStateFn<T extends Array<unknown>>(
  fn: (...args: T) => Promise<void>
) {
  return async (...args: T) => {
    if (replicationStateChangeInProgress) throw "concurent network change";
    replicationStateChangeInProgress = true;
    try {
      await fn(...args);
    } finally {
      replicationStateChangeInProgress = false;
    }
  };
}

const startNetworkGame = repStateFn(
  async (db: GBDatabase, setCode: (code: number) => void) => {
    try {
      const code = await handshakeBegin();
      console.log(`# join code is ${code}`);
      setCode(code);
      const { uid, oid, gid } = await handshakeWait();
      await clearGameStateCollection(db);
      console.log(`# starting new network game`);
      replicationState = await gbdbBeginReplication(signalingServerUrl, gid);
      await db.game_state.insertLocal("network", {
        uid,
        oid,
        gid,
      });
    } finally {
      handshakeCleanup();
    }
  }
);

const joinNetworkGame = repStateFn(async (db: GBDatabase, code: number) => {
  try {
    const { uid, oid, gid } = await handshakeJoin(code);
    await clearGameStateCollection(db);
    console.log(`# joining a network game`);
    replicationState = await gbdbBeginReplication(signalingServerUrl, gid);
    await db.game_state.insertLocal("network", {
      uid,
      oid,
      gid,
    });
  } finally {
    handshakeCleanup();
  }
});

const reconnectNetwork = repStateFn(async (db: GBDatabase) => {
  const doc = await db.game_state.getLocal("network");
  const gid = doc?.get("gid");
  if (gid && replicationState === undefined) {
    console.log(`# reconnecting to a network game`);
    replicationState = await gbdbBeginReplication(signalingServerUrl, gid);
  }
});

const leaveNetworkGame = repStateFn(async (db: GBDatabase) => {
  console.log(`# leaving a network game`);
  await replicationState
    ?.cancel()
    .catch(console.error)
    .finally(() => {
      replicationState = undefined;
    });
  await clearGameStateCollection(db).catch(console.error);
  await db.game_state
    .getLocal("network")
    .then((doc) => doc?.remove())
    .catch(console.error);
});

// reconnect requires NetworkGame to be mounted

export function NetworkGame({ allowNew = false }: { allowNew?: boolean }) {
  const { gbdb: db } = useData();
  const [dialogOpen, setDialog] = useState(false);
  const { active } = useNetworkState();

  const { setting$ } = useSettings();
  const [networkEnabled, setNetworkEnabled] = useState(false);
  useEffect(() => {
    const sub = setting$
      ?.pipe(map((s) => s?.toJSON().data.networkPlay))
      .subscribe((n) => setNetworkEnabled(!!n));
    return () => {
      sub?.unsubscribe();
    };
  }, [setting$]);

  // how to get peer count when replicationState is global and can be undefined?
  // where else can I store it?  What doesn't get unmountsed?
  // Top level to the entire App?
  //
  // const [peers, setPeers] = useState(0);
  // useEffect(() => {
  //   if (!replicationState) return;
  //   let canceled = false;
  //   firstValueFrom(replicationState.peerStates$).then((peers) => {
  //     if (!canceled) {
  //       setPeers(peers.size);
  //     }
  //   });
  //   return () => {
  //     canceled = true;
  //   };
  // }, []);

  useEffect(() => {
    if (db && active && !replicationState) {
      reconnectNetwork(db);
    }
  }, [db, active]);

  const [color, setColor] = useState<
    "default" | "success" | "warning" | "error"
  >("default");
  useEffect(() => {
    // console.log(`active: ${active} peers: ${peers}`);
    // setColor(!active ? "default" : peers > 0 ? "success" : "error");
    setColor(!active ? "default" : "success");
  }, [
    active,
    // , peers
  ]);
  if (!db) return;

  return (
    <>
      <IconButton
        size="small"
        color={color}
        disabled={!networkEnabled || (!allowNew && !active)}
        onClick={() => setDialog(true)}
      >
        <Sync />
      </IconButton>
      <Dialog open={dialogOpen} onClose={() => setDialog(false)}>
        <DialogTitle>Network Game Setup</DialogTitle>
        <DialogContent>
          <NetworkStepper
            allowNew={allowNew}
            close={() => {
              setDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

type HandshakeSteps = "New" | "Start" | "Join" | "Ready" | "Block";

interface StepperProps {
  setActiveStep: (step: HandshakeSteps) => void;
  close?: () => void;
}

const StepNew = (props: StepperProps) => {
  const { setActiveStep } = props;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
      <Button variant="contained" onClick={() => setActiveStep("Start")}>
        Start a Game
      </Button>
      <Button variant="contained" onClick={() => setActiveStep("Join")}>
        Join a Game
      </Button>
    </Box>
  );
};

const StepStart = (props: StepperProps) => {
  const { setActiveStep } = props;
  const { gbdb: db } = useData();
  const [code, setCode] = useState<number>();

  useEffect(() => {
    if (!db) return;
    startNetworkGame(db, setCode)
      .then(() => {
        setActiveStep("Ready");
      })
      .catch((error) => {
        console.error(error);
        setActiveStep("New");
      });
  }, [db, setActiveStep]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        alignItems: "center",
      }}
    >
      <Typography>Share this join code:</Typography>
      <Typography variant="h3">{code?.toString().padStart(4, "0")}</Typography>
      <Typography>Waiting for opponent to connect.</Typography>
      <Button
        variant="contained"
        onClick={() => {
          handshakeCleanup();
          props.setActiveStep("New");
        }}
      >
        Cancel
      </Button>
    </Box>
  );
};

const StepJoin = (props: StepperProps) => {
  const { setActiveStep } = props;
  const { gbdb: db } = useData();
  const [code, setCode] = useState<number>();
  const [waiting, setWaiting] = useState(false);
  if (!db) return;

  console.log;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
      <TextField
        sx={{ margin: "1em" }}
        label="game join code"
        variant="outlined"
        disabled={waiting}
        inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
        onChange={(ev) => setCode(Number(ev.target.value))}
      />
      <Button
        variant="contained"
        disabled={!code || waiting}
        onClick={() => {
          setWaiting(true);
          joinNetworkGame(db, code ?? 0)
            .then(() => setActiveStep("Ready"))
            .then(() => setWaiting(false))
            .catch((error) => {
              console.error(error);
              setActiveStep("New");
            });
        }}
      >
        Join a Game
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          handshakeCleanup();
          setWaiting(false);
          setActiveStep("New");
        }}
      >
        Cancel
      </Button>
    </Box>
  );
};

const StepReady = (props: StepperProps) => {
  const { setActiveStep } = props;
  const { gbdb: db } = useData();
  const navigate = useNavigate();
  const { setting$ } = useSettings();
  if (!db) return;

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h6">Connected</Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={() =>
            leaveNetworkGame(db)
              .then(() => setActiveStep("New"))
              // FIXME disabled blocker and navigate to "/game" ?
              .then(async () => {
                setting$ &&
                  (await firstValueFrom(setting$).then((s) =>
                    s?.incrementalPatch({ gamePlayRoute: undefined })
                  ));
                navigate("/");
              })
          }
        >
          Leave Game
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={() => {
            props.close?.();
          }}
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};

const StepBlock = () => {
  return (
    <Typography>
      Network Games must be started from the inital guild selection screen.
    </Typography>
  );
};

function NetworkStepper({
  allowNew = false,
  close,
}: {
  allowNew: boolean;
  close: () => void;
}) {
  const { active } = useNetworkState();
  const [activeStep, setActiveStep] = useState<HandshakeSteps>(
    allowNew ? "New" : "Block"
  );

  useEffect(() => {
    if (active) {
      setActiveStep("Ready");
    }
  }, [active]);

  useEffect(() => {
    return () => {
      handshakeCleanup();
    };
  }, []);

  return (
    <Box>
      {activeStep === "New" && <StepNew setActiveStep={setActiveStep} />}
      {activeStep === "Start" && <StepStart setActiveStep={setActiveStep} />}
      {activeStep === "Join" && <StepJoin setActiveStep={setActiveStep} />}
      {activeStep === "Ready" && (
        <StepReady setActiveStep={setActiveStep} close={close} />
      )}
      {activeStep === "Block" && <StepBlock />}
    </Box>
  );
}

let handshakeSocket: WebSocket | undefined;

function handshakeBegin(): Promise<number> {
  return new Promise((resolve, reject) => {
    handshakeSocket = new WebSocket(signalingServerUrl);

    handshakeSocket.onopen = () => {
      handshakeSocket?.send(
        JSON.stringify({ type: "handshake-begin" } as HandshakeInitMessage)
      );
    };

    handshakeSocket.onclose = () => {
      reject("socket closed");
    };

    handshakeSocket.onerror = (event) => {
      reject(event);
    };

    handshakeSocket.onmessage = (event) => {
      const message: HandshakeMessage = JSON.parse(event.data);
      switch (message.type) {
        case "handshake-response":
          {
            if (handshakeSocket) {
              handshakeSocket.onmessage = null;
            }
            resolve(message.code);
          }
          break;
        default:
      }
    };
  });
}

function handshakeJoin(id: number): Promise<HandshakeIDs> {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject("Invalid Arguments (id undefined)");
      return;
    }

    handshakeSocket = new WebSocket(signalingServerUrl);

    handshakeSocket.onopen = () => {
      handshakeSocket?.send(
        JSON.stringify({
          type: "handshake-join",
          code: id,
        } as HandshakeJoinMessage)
      );
    };

    handshakeSocket.onclose = () => {
      reject("socket closed");
    };

    handshakeSocket.onerror = (event) => {
      reject(event);
    };

    handshakeSocket.onmessage = (event) => {
      const message: HandshakeMessage = JSON.parse(event.data);
      switch (message.type) {
        case "handshake-complete":
          {
            const uid = message.yourId;
            if (!uuid.validate(uid)) {
              reject(`invalid uID ${uid}`);
              return;
            }
            const oid = message.otherId;
            if (!uuid.validate(oid)) {
              reject(`invalid oID ${oid}`);
              return;
            }
            const uidData = uuid.parse(uid);
            const oidData = uuid.parse(oid);
            const gidData = uidData.map((a, i) => a ^ oidData[i]);
            const gid = uuid.v4({ random: gidData });
            resolve({ uid, oid, gid });
          }
          break;
      }
    };
  });
}

function handshakeWait(): Promise<HandshakeIDs> {
  return new Promise((resolve, reject) => {
    if (handshakeSocket?.readyState !== 1) {
      reject("socket closed");
      return;
    }

    handshakeSocket.onclose = () => {
      reject("socket closed");
    };

    handshakeSocket.onerror = (event) => {
      reject(event);
    };

    handshakeSocket.onmessage = (event) => {
      const message: HandshakeMessage = JSON.parse(event.data);
      switch (message.type) {
        case "handshake-complete":
          {
            const uid = message.yourId;
            if (!uuid.validate(uid)) {
              reject(`invalid uID ${uid}`);
              return;
            }
            const oid = message.otherId;
            if (!uuid.validate(oid)) {
              reject(`invalid oID ${oid}`);
              return;
            }
            const uidData = uuid.parse(uid);
            const oidData = uuid.parse(oid);
            const gidData = uidData.map((a, i) => a ^ oidData[i]);
            const gid = uuid.v4({ random: gidData });
            resolve({ uid, oid, gid });
          }
          break;
      }
    };
  });
}

function handshakeCleanup() {
  handshakeSocket?.close();
  handshakeSocket = undefined;
}
