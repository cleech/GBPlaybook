// src/routes/library.index.tsx
import React from "react";
import { GuildList } from "../pages/library";

// This is the index route for the parent '/library' route
export const index = true;

// Use the default export convention matching your other files
const element = () => <GuildList />;
export default element;

/*
// Alternative: Component export convention
export function Component() {
    return React.createElement(GuildList);
}
Component.displayName = "LibraryIndexScreen";
*/
