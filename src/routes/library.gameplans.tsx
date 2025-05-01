// src/routes/library.gameplans.tsx
import React from "react";
import { GamePlans } from "../pages/library";

// Path relative to the parent '/library' route
export const path = "gameplans";

// Use the default export convention
const element = () => <GamePlans />;
export default element;

/*
// Alternative: Component export convention
export function Component() {
    return React.createElement(GamePlans);
}
Component.displayName = "LibraryGamePlansScreen";
*/
