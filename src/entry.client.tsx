// src/index.tsx
import React from "react"; // Import React if using StrictMode or Fragments
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

ReactDOM.hydrateRoot(
  document,
  // <React.StrictMode> // Uncomment if needed
  <HydratedRouter />
  // </React.StrictMode>
);

