import { useEffect, useState } from "react";
import { Snackbar, Alert, Button } from "@mui/material";
import { useData } from "../../hooks/useData";

export const ResumeSnackBar = () => {
  const { gbdb: db } = useData();

  // not using useRxData because setShowSnack is used later
  const [showSnack, setShowSnack] = useState(false);
  useEffect(() => {
    if (!db) {
      return;
    }
    let cancled = false;
    const fetchData = async () => {
      const game = await db.game_state.findByIds(["Player1", "Player2"]).exec();
      if (!cancled) {
        if (game.size > 0) {
          setShowSnack(true);
        }
      }
    };
    fetchData().catch(console.error);
    return () => {
      cancled = true;
    };
  }, [db]);

  return (
    <Snackbar
      open={showSnack}
      onClose={() => setShowSnack(false)}
      autoHideDuration={6000}
    >
      <Alert
        severity="info"
        action={
          <Button size="small" href="/game/draft/play">
            Resume Game
          </Button>
        }
      >
        There is an existing game that can be resumed.
      </Alert>
    </Snackbar>
  );
};

export default ResumeSnackBar;
