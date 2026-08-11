import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";

// "scratch/App" only exists at runtime via Module Federation -- there's no
// real file for Jest to resolve, so it's mocked as a virtual module. This is
// the standard pattern for testing a Shell/host that consumes a federated
// remote (.claude/rules/routing-loading-errors.md's "layer 1" -- a remote
// crashing or failing to load -- is exactly what RouteBoundary.test.tsx-style
// coverage would target; this file covers the Shell's own routing/layout).
jest.mock(
  "scratch/App",
  () => ({
    // `__esModule: true` matters here: without it, Babel's CJS interop
    // treats this whole object as ITSELF the default export (double-wraps
    // it), and React.lazy's dynamic import receives an object instead of a
    // component -- "Element type is invalid" with no obvious cause. Every
    // other MFE entry point (a real webpack/MF remote) sets this correctly
    // on its own; only a hand-written virtual mock needs it spelled out.
    __esModule: true,
    default: () => <div>scratch remote mock</div>,
  }),
  { virtual: true },
);

describe("App", () => {
  it("renders the home page at /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "LynkFlow Shell" })).toBeInTheDocument();
  });

  it("renders the layout nav on every route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("LynkFlow")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Scratch (federation smoke test)" }),
    ).toBeInTheDocument();
  });

  it("renders the federated remote's App at /scratch", async () => {
    render(
      <MemoryRouter initialEntries={["/scratch"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText("scratch remote mock")).toBeInTheDocument();
  });

  it("renders the not-found page for an unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/nope"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});
