import globals from "globals";
import tseslint from "typescript-eslint";

import react from "@lynkflow/config/eslint/react";

/**
 * Thin extends of the shared React ESLint layer. Only two things are
 * specific to this repo: the webpack DefinePlugin build global (PORT isn't
 * injected, but the smoke-test remote URL is -- see webpack.config.mjs) and
 * the jest.setup.ts default-project allowance. Everything else
 * (recommendedTypeChecked, react-hooks, .cjs/.config overrides, test-file
 * exceptions) lives in @lynkflow/config -- don't re-add it here.
 */
export default [
  ...react({
    tsconfigRootDir: import.meta.dirname,
    allowDefaultProject: ["jest.setup.ts"],
  }),

  // This repo consumes @lynkflow/config from the REAL published registry
  // (0.0.1), not a local file: link -- so it doesn't pick up a fix made to
  // the local lynkflow-config source until that package is actually
  // republished. scripts/install-local.mjs is a standalone dev-tooling
  // script, not part of this app's TS program, so it needs the same
  // disableTypeChecked treatment @lynkflow/config's own base.mjs already
  // gives *.config.* files -- added here directly so this repo's CI doesn't
  // depend on a registry publish it doesn't control the timing of. See
  // .claude/rules/publishing.md's 12 Aug 2026 incident note.
  {
    files: ["scripts/**/*.{js,mjs,cjs}"],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
];
