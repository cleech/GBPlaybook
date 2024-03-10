import { GBSetupSteps } from "../../models/gbdb";


export function stepToNav(step: GBSetupSteps) {
  switch (step) {
    case "Guilds":
      return "/game";
    case "Draft":
      return "/game/draft";
    case "Game":
      return "/game/draft/play";
  }
}
