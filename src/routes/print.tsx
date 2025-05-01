// src/routes/print.tsx
import { CardPrintScreen } from "../pages/print";

export const path = "print"; // Path relative to the parent (App layout)
const element = () => <CardPrintScreen />;
export default element; // Export the element for use in routing
