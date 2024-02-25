import { useEffect, useState } from "react";
import { Snackbar, Alert, Button } from "@mui/material";
import { useData } from "../../components/DataContext";

export const ResumeSnackBar = () => {
  const { gbdb: db } = useData();
  const [showSnack, setShowSnack] = useState(false);
  useEffect(() => {
    // wait for db init
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
