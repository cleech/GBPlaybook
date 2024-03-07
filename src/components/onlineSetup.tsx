import { useEffect, useMemo, useState } from "react";
import { Box, Button, Dialog, DialogContent, IconButton } from "@mui/material";
import { Sync } from "@mui/icons-material";
import { useData } from "../hooks/useData";
import { GBDatabase, GBGameState, gbdbBeginReplication } from "../models/gbdb";
import {
  RxWebRTCReplicationPool,
  SimplePeer,
} from "rxdb/plugins/replication-webrtc";
import { RxLocalDocument } from "rxdb";

// for testing before the handshake protocol is done
// uuid.v4()
const player1_uuid = "c1ea2dfa-552a-4d7a-9fa5-eb30656db83b";
// uuid.v4()
const player2_uuid = "458fbbc6-2a5f-4054-a592-160c42cb1dc5";
// uuid.v4({random: uuid.parse(p1).map((a,i) => a ^ uuid.parse(p2)[i])})
const game_uuid = "8465963c-7f75-4d2e-ba37-fd3c27a6a5fe";

let replicationState:
  | RxWebRTCReplicationPool<GBGameState, SimplePeer>
  | undefined = undefined;

interface NetworkLocalState {
  uid: string;
  oid: string;
  gid: string;
}

async function startNetworkGame(db: GBDatabase) {
  await db.game_state
    .insertLocal("network", {
      uid: player1_uuid,
      oid: player2_uuid,
      gid: game_uuid,
    })
    .catch(console.error);
  replicationState = await gbdbBeginReplication(game_uuid);
}

async function joinNetworkGame(db: GBDatabase) {
  await db.game_state
    .insertLocal("network", {
      uid: player2_uuid,
      oid: player1_uuid,
      gid: game_uuid,
    })
    .catch(console.error);
  replicationState = await gbdbBeginReplication(game_uuid);
}

async function reconnectNetwork(db: GBDatabase) {
  const doc = await db.game_state.getLocal("network");
  const gid = doc?.get("gid");
  replicationState = await gbdbBeginReplication(gid);
}

async function leaveNetworkGame(db: GBDatabase) {
  const doc = await db.game_state.getLocal("network");
  await doc?.remove();
  await replicationState?.cancel();
  replicationState = undefined;
}

export function useNetworkState() {
  const { gbdb: db } = useData();
  const [active, setActive] = useState(false);
  const [state, setState] = useState<RxLocalDocument<NetworkLocalState>>();

  const network$ = useMemo(() => db?.game_state.getLocal$("network"), [db]);
  useEffect(() => {
    if (!network$) {
      return;
    }
    const sub = network$.subscribe((doc) => {
      if (doc && !doc.deleted) {
        setState(doc);
        setActive(true);
      } else {
        setState(undefined);
        setActive(false);
      }
    });
    return () => sub.unsubscribe();
  }, [network$]);
  return { active: active, netDoc: state };
}

export function NetworkGame() {
  const { gbdb: db } = useData();
  const [dialogOpen, setDialog] = useState(false);
  const { active } = useNetworkState();

  useEffect(() => {
    if (!db) {
      return;
    }
    if (active && !replicationState) {
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
            <Button
              variant="contained"
              disabled={active}
              onClick={() => startNetworkGame(db)}
            >
              Start a Game
            </Button>
            <Button
              variant="contained"
              disabled={active}
              onClick={() => joinNetworkGame(db)}
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
