// src/routes/app-layout.tsx
import App from "../App"; // Import the main App component

// This module defines the layout but doesn't have its own path segment.
// Its children will be nested within it.
const element = () => <App />; // App should contain an <Outlet />
export default element; // Export the element for use in routing

// Using the lazy function export style:
/*
import React from "react";
import AppComponent from "../App"; // Rename import to avoid conflict

export function Component() {
    return React.createElement(AppComponent);
}

Component.displayName = "AppLayout";
*/
