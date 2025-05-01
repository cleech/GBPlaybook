// src/routes/library.refcards.tsx
import React from "react";
import { RefCards } from "../pages/library";

// Path relative to the parent '/library' route
export const path = "refcards";

// Use the default export convention
const element = () => <RefCards />;
export default element;

/*
// Alternative: Component export convention
export function Component() {
    return React.createElement(RefCards);
}
Component.displayName = "LibraryRefCardsScreen";
*/
