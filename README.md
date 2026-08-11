# lynkflow-shell

The LynkFlow parent app: global routing, layout, and Module Federation host
composing every domain MFE. Owns the `<BrowserRouter>`, the outer `<Routes>`,
and (eventually) auth/session and language state -- no domain business logic
lives here (`.claude/rules/architecture.md`).

Platform-wide rules live one level up, in the workspace root's
`.claude/rules/` -- this repo carries no Claude-specific files of its own
(same convention as `lynkflow-mfe-template`). This README covers everything
you need to work in this repo without that external context.

**Current scope is deliberately minimal**, by explicit decision when this
repo was first built: Module Federation host + top-level routing + a bare,
unbranded layout. Explicitly NOT built yet:

- **Auth/login.** No `lynkflow-users-svc` exists yet to authenticate against
  (`.claude/rules/progress.md`), so there's no session check, no login
  screen, no redirect-to-login -- every route renders unconditionally. Build
  this against `.claude/rules/auth.md`'s Shell-owns-the-session contract once
  a real login flow exists to build against.
- **Runtime i18n / RTL.** `public/index.html` hardcodes `lang="en"
  dir="ltr"`. The real mechanism (a synchronous inline script reading a
  profile-backed cookie, reconciled against the logged-in user's stored
  preference) is fully specified in `.claude/rules/i18n.md` -- not wired up
  here yet.
- **Branding.** No logo, no brand colors beyond the plain `@lynkflow/ui-kit`
  tokens every MFE already uses.

## Run it standalone

**Before `npm install` works at all**, two `@lynkflow/*` packages aren't on
the registry yet and are consumed via a local `file:` link instead
(`.claude/rules/tooling.md`) -- both siblings need to already exist at the
workspace root, and one of them needs a one-time build:

1. `../lynkflow-config` must exist (source only, no build step -- it ships
   plain `.mjs`/`.cjs`/`.json`).
2. `../lynkflow-ui-kit` must exist **and have been built at least once**:
   ```bash
   cd ../lynkflow-ui-kit && npm install && npm run build
   ```
   `dist/` is gitignored, so a fresh clone has none until this runs. Skip
   this and `npm install` here will succeed, but `npm run typecheck`/`build`
   will fail with `Cannot find module '@lynkflow/ui-kit'`.
3. `cp .npmrc.example .npmrc` -- needed for `install-links=true` (so
   `@lynkflow/config`'s own transitive deps actually get installed; see
   `.claude/rules/tooling.md`'s "Known limitations"). No registry token is
   required for this repo today: both dependencies above resolve via local
   `file:` links, not a real registry fetch.

Then:

```bash
cp .env.example .env
npm install
npm run dev
```

Opens on `http://localhost:3000` (or `.env`'s `PORT`). With no remote running,
you'll see the home page and nav; the "Scratch" link will fail to load (no
`scratch` remote listening) until you also run the federation smoke test
below.

This two-sibling-repo precondition goes away the moment `@lynkflow/config`
and `@lynkflow/ui-kit@0.1.1` are actually published (`progress.md`'s
publishing queue) -- at that point this becomes a real dependency install
like any other npm package, no sibling repos or manual builds required.

## Federation smoke test

There is no real domain MFE yet -- `lynkflow-users-ui` is step 12 in
`.claude/rules/progress.md`, not started. To prove the Shell can actually
federate against a *running* remote end to end, `webpack.config.mjs`'s
`remotes` map points at **`scratch-test-ui`** (the disposable template copy
at the workspace root, `.env.example`'s `SCRATCH_REMOTE_URL`) under the
remote name `scratch`.

To see it live:

```bash
# terminal 1 -- the "remote"
cd ../scratch-test-ui && npm run dev   # serves remoteEntry.js on :3001

# terminal 2 -- the host
cd ../lynkflow-shell && npm run dev    # serves the Shell on :3000
```

Then open `http://localhost:3000/scratch`. Verified end to end when this was
built: both dev servers compile clean; `scratch-test-ui`'s `remoteEntry.js`
is a real webpack container exposing `./App` and `./Routes` under the name
`scratch`; the Shell's own bundle resolves and references
`scratch@http://localhost:3001/remoteEntry.js` exactly as configured; a
production `npm run build` of the Shell compiles with `remote scratch/App`
in its module graph. (No headless browser was available to also confirm the
remote's DOM actually paints inside the Shell's page -- the build- and
network-level wiring above is what was verified; open it in a real browser
to see the render.)

**Retire this the moment a real domain MFE is ready.** Delete
`SCRATCH_REMOTE_URL` from `.env.example`, the `scratch` entry from
`webpack.config.mjs`'s `remotes`, the `ScratchApp` lazy import + its route in
`App.tsx`, and `src/types/federation.d.ts`'s `scratch/App` stub -- then add
the real remote (e.g. `users: "users@http://localhost:3001/remoteEntry.js"`)
the same way.

## Adding a real domain MFE to the registry

The "MFE registry" (`.claude/rules/architecture.md`) is just this repo's own
`webpack.config.mjs` (`remotes`) + `App.tsx` (the route). To wire in
`lynkflow-users-ui` once it exists:

1. `webpack.config.mjs`: add `users: "users@<its remoteEntry.js URL>"` to
   `remotes` (coordinate the URL/port with that repo's own `.env`).
2. `src/types/federation.d.ts`: add a `declare module "users/App"` stub
   (copy the `scratch/App` block, change the module specifier).
3. `App.tsx`: `const UsersApp = lazy(() => import("users/App"));` and a
   `<Route path="/users/*" element={<RouteBoundary><UsersApp language={...} /></RouteBoundary>} />`.

No shared package involved -- only the Shell needs the full prefix-to-remote
map; each MFE only needs to know its own base path
(`.claude/rules/routing-loading-errors.md`).

## What's temporary vs. permanent here

`src/components/ErrorFallback/` and `src/components/PageLoadingSkeleton/`
are **temporary local copies** -- same situation as
`lynkflow-mfe-template`'s. They belong in `@lynkflow/ui-kit`
(`.claude/rules/routing-loading-errors.md`) but ui-kit@0.1.0 doesn't ship
them yet. Delete both folders and import from the package once it does.
`src/components/RouteBoundary/` is the same component/contract as the
template's -- each repo needs its own copy per
`.claude/rules/architecture.md`'s no-cross-repo-source-import rule; neither
imports it from the other.

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Standalone dev server (webpack-dev-server) |
| `npm run build` | Production build (`dist/`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` / `test:coverage` | Jest + Testing Library |
| `npm run lint` | Type-aware ESLint |

Full per-package release/versioning flow (for `@lynkflow/config`,
`@lynkflow/ui-kit`, etc. this repo consumes): `docs/packages-guide.md` at the
workspace root.
