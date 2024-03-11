import { useOutletContext } from "react-router-dom";
import { GBGameStateDoc } from "../models/gbdb";
import { Observable } from "rxjs";

export type GameContextType = {
  gameState1$: Observable<GBGameStateDoc | null>;
  gameState2$: Observable<GBGameStateDoc | null>;
};

export function useGameState() {
  return useOutletContext<GameContextType>();
}
