// src/routes/library.guild.tsx
import React from "react";
import { Roster } from "../pages/library";

// Path relative to the parent '/library' route (dynamic segment)
export const path = ":guild";

// Use the default export convention
const element = () => <Roster />;
export default element;

/*
// Alternative: Component export convention
export function Component() {
    return React.createElement(Roster);
}
Component.displayName = "LibraryGuildScreen";
*/
