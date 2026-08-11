import { TextDecoder, TextEncoder } from "node:util";

// jsdom doesn't implement TextEncoder/TextDecoder, but react-router v7 (and
// anything else using the web streams/URL APIs) expects them to exist. Node
// provides spec-compliant versions, so map them onto the jsdom global.
Object.assign(globalThis, {
  TextEncoder: globalThis.TextEncoder ?? TextEncoder,
  TextDecoder: globalThis.TextDecoder ?? TextDecoder,
});

import "@testing-library/jest-dom";
