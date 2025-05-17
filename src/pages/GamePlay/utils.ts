import { GBSetupSteps } from "../../models/gbdbTypes";


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
