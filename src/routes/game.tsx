// src/routes/game.tsx
/*
import GamePlayComponent from "../pages/GamePlay"; // Renamed import

// Path relative to the parent (App layout)
export const path = "game";

// Use the Component export convention for the layout
export function Component() {
    // GamePlayComponent should contain an <Outlet /> for children to render into
    return React.createElement(GamePlayComponent);
}

Component.displayName = "GameLayout";
*/
// Remove the children export, as they are now in separate files
// export const children = [ ... ];


// Alternative: Direct element export for the layout
import GamePlay from "../pages/GamePlay";
export const path = "game";
const element = () => <GamePlay />; // GamePlay should contain an <Outlet />
export default element; // Export the element for use in routing

