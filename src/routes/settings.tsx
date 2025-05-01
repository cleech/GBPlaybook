// src/routes/settings.tsx
import Settings from "../pages/settings";

export const path = "settings"; // Path relative to the parent (App layout)
const element = () => <Settings />;
export default element; // Export the element for use in routing

// Using the lazy function export style:
/*
import React from "react";
import SettingsComponent from "../pages/settings"; // Rename import

export function Component() {
    return React.createElement(SettingsComponent);
}
Component.displayName = "SettingsScreen";
*/
