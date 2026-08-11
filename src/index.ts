/**
 * Module Federation async boundary. Same reasoning as every MFE's
 * src/index.ts: webpack needs the shared scope (react, react-dom,
 * react-router-dom) initialized before any shared module is evaluated, and a
 * dynamic import creates that boundary. The Shell needs this too, even
 * though it's the host and not a remote -- it's still negotiating shared
 * singleton versions with whatever remotes it loads.
 */
void import("./bootstrap");

export {};
