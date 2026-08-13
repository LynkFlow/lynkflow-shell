/**
 * The Shell's actual mount logic -- loaded via main.tsx's dynamic import,
 * after Module Federation's shared-scope negotiation completes. Unlike an
 * MFE (which has a separate bootstrap.tsx for standalone dev vs. being
 * mounted by a host), the Shell IS the host -- there's nothing above it to
 * mount it, so there's no dual-mode split here.
 *
 * This is where the top-level <BrowserRouter> lives (.claude/rules/
 * routing-loading-errors.md -- "Shell owns the top-level <BrowserRouter> and
 * the outer <Routes>"). It also imports @lynkflow/ui-kit's compiled
 * stylesheet exactly once, globally, per .claude/rules/ui-kit.md -- no MFE
 * should import it itself.
 */
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
