/**
 * Webpack entry point / Module Federation async boundary. Same reasoning as
 * every MFE's own entry point: webpack needs the shared scope (react,
 * react-dom, react-router-dom) initialized before any shared module is
 * evaluated, and a dynamic import creates that boundary. The Shell needs
 * this too, even though it's the host and not a remote -- it's still
 * negotiating shared singleton versions with whatever remotes it loads.
 *
 * This file MUST stay a thin shim -- it's the one module webpack evaluates
 * synchronously before shared-scope negotiation completes, so it can't
 * itself import anything (react-dom, react-router-dom, App) that touches a
 * shared singleton. The actual mount logic lives in app/bootstrap.tsx,
 * loaded only after this dynamic import resolves.
 */
void import("./app/bootstrap");

export {};
