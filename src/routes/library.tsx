// src/routes/library.tsx
import Library from "../pages/library"; // Import the layout component

export const path = "library"; // Path relative to the parent (App layout)

// Export the layout element using the default export convention
const element = () => <Library />; // Library should contain an <Outlet />
export default element;

// Remove the children export, as they are now in separate files
// export const children = [ ... ];

/*
// Alternative: Component export convention for the layout
import React from "react";
import LibraryComponent from "../pages/library"; // Renamed import

export const path = "library";

export function Component() {
    // LibraryComponent should contain an <Outlet /> for children to render into
    return React.createElement(LibraryComponent);
}
Component.displayName = "LibraryLayout";
*/
