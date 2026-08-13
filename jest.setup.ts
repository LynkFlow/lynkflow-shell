import { TextDecoder, TextEncoder } from "node:util";

// jsdom doesn't implement TextEncoder/TextDecoder, but react-router v7 (and
// anything else using the web streams/URL APIs) expects them to exist. Node
// provides spec-compliant versions, so map them onto the jsdom global.
Object.assign(globalThis, {
  TextEncoder: globalThis.TextEncoder ?? TextEncoder,
  TextDecoder: globalThis.TextDecoder ?? TextDecoder,
});

import "@testing-library/jest-dom";

// Same pattern as every MFE's own jest.setup.ts: __AUTH_API_BASE_URL__ only
// exists via webpack's DefinePlugin at build time (see src/env.ts and
// webpack.config.mjs) -- Jest doesn't run through webpack, so this global is
// genuinely undefined during a test run without this. A test that needs a
// different value should `jest.mock("./src/env")` rather than change this.
Object.assign(globalThis, {
  __AUTH_API_BASE_URL__: "/api/auth",
});
