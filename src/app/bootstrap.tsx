// Actual mount logic, loaded via main.tsx's dynamic import after Module
// Federation's shared-scope negotiation completes. Owns the top-level
// <BrowserRouter> and the one global @lynkflow/ui-kit stylesheet import.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@lynkflow/ui-kit/styles.css";
import "../styles.css";

import App from "./App";
import { ROOT_ELEMENT_ID } from "./config";

const container = document.getElementById(ROOT_ELEMENT_ID);
if (!container) throw new Error(`Root container #${ROOT_ELEMENT_ID} not found`);

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
