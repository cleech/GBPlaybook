import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
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

const signalingServerUrl =
  import.meta.env.VITE_SIGNALING_URL ??
  "wss://gbplaybook-webrtc-server.onrender.com";

let replicationState:
  | RxWebRTCReplicationPool<GBGameState, SimplePeer>
  | undefined = undefined;

async function clearGameStateCollection(db: GBDatabase) {
  await db.game_state
    .find()
    .exec()
    .then((docs) => db.game_state.bulkRemove(docs.map((d) => d._id)))
    .catch(console.error);
}

// only allow one async update to the replication state at a time
let replicationStateChangeInProgress = false;

function repStateFn<T>(fn: (db: GBDatabase, ...args: T[]) => Promise<void>) {
  return async (db: GBDatabase, ...args: T[]) => {
    if (replicationStateChangeInProgress) return;
    replicationStateChangeInProgress = true;
    await fn(db, ...args);
    replicationStateChangeInProgress = false;
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
    } catch (error) {
      console.error(error);
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
  } catch (error) {
    console.error(error);
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
  await replicationState?.cancel();
  replicationState = undefined;
  await clearGameStateCollection(db);
  const doc = await db.game_state.getLocal("network");
  await doc?.remove();
});

// reconnect requires eith NetworkStatus or NetworkGame to be mounted

export function NetworkStatus() {
  // const theme = useTheme();
  const { gbdb: db } = useData();
  const { active } = useNetworkState();

  useEffect(() => {
    if (db && active && !replicationState) {
      reconnectNetwork(db);
    }
  }, [db, active]);

  const color = active ? "palette.success" : "text.secondary";

  return (
    <IconButton size="small" disabled>
      <Sync sx={{ color: color }} />
    </IconButton>
  );
}

export function NetworkGame() {
  const { gbdb: db } = useData();
  const [dialogOpen, setDialog] = useState(false);
  const { active } = useNetworkState();
  const [code, setCode] = useState<number>();

  useEffect(() => {
    if (db && active && !replicationState) {
      reconnectNetwork(db);
    }
  }, [db, active]);

  if (!db) {
    return null;
  }

  return (
    <>
      <IconButton size="small" onClick={() => setDialog(true)}>
        <Sync />
      </IconButton>
      <Dialog open={dialogOpen} onClose={() => setDialog(false)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1em" }}>
            <TextField
              variant="outlined"
              inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
              // onChange={(ev) => setCode(ev.target.value.padStart(4, "0"))}
              onChange={(ev) => setCode(Number(ev.target.value))}
            />
            <Typography>{code}</Typography>
            <Button
              variant="contained"
              disabled={active}
              onClick={() => startNetworkGame(db, setCode)}
            >
              Start a Game
            </Button>
            <Button
              variant="contained"
              disabled={active}
              onClick={() => {
                if (code) joinNetworkGame(db, code);
              }}
            >
              Join a Game
            </Button>
            <Button
              variant="contained"
              disabled={!active}
              onClick={() => leaveNetworkGame(db)}
            >
              Leave Game
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

let handshakeSocket: WebSocket | undefined;

function handshakeBegin(): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject("handshake timeout");
    }, 10000);

    handshakeSocket = new WebSocket(signalingServerUrl);

    handshakeSocket.onopen = () => {
      handshakeSocket?.send(
        JSON.stringify({ type: "handshake-begin" } as HandshakeInitMessage)
      );
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

    setTimeout(() => {
      reject("handshake timeout");
    }, 10000);

    handshakeSocket = new WebSocket(signalingServerUrl);

    handshakeSocket.onopen = () => {
      handshakeSocket?.send(
        JSON.stringify({
          type: "handshake-join",
          code: id,
        } as HandshakeJoinMessage)
      );
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
    let uid: string;
    let oid: string;
    let gid: string;

    if (handshakeSocket?.readyState !== 1) {
      reject("socket closed");
      return;
    }

    setTimeout(() => {
      reject("handshake timeout");
    }, 10000);

    handshakeSocket.onmessage = (event) => {
      const message: HandshakeMessage = JSON.parse(event.data);
      switch (message.type) {
        case "handshake-complete":
          {
            uid = message.yourId;
            if (!uuid.validate(uid)) {
              reject(`invalid uID ${uid}`);
              return;
            }
            oid = message.otherId;
            if (!uuid.validate(oid)) {
              reject(`invalid oID ${oid}`);
              return;
            }
            const uidData = uuid.parse(uid);
            const oidData = uuid.parse(oid);
            const gidData = uidData.map((a, i) => a ^ oidData[i]);
            gid = uuid.v4({ random: gidData });
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
