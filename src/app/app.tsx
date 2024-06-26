import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./globals.css";
import { configure } from "mobx";
import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
});

configure({
  enforceActions: "never",
});
// Import the generated route tree
import { routeTree } from "../routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree, defaultStaleTime: Infinity });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
