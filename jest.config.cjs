const react = require("@lynkflow/config/jest/react");

/** @type {import('jest').Config} */
module.exports = {
  ...react,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    ...react.moduleNameMapper,
    // Local addition, not pushed up to @lynkflow/config: this is the first
    // repo with image imports (the auth screens' logo/hero/success/mail
    // assets, src/assets/) -- an app-specific need, not yet a platform-wide
    // one (.claude/rules/tooling.md's "application-specific overrides stay
    // local"). See src/test/fileMock.cjs.
    "\\.(svg|png|jpe?g|gif)$": "<rootDir>/src/test/fileMock.cjs",
  },
  collectCoverageFrom: [
    ...react.collectCoverageFrom,
    // Test helpers/mocks -- testing infrastructure, not app source.
    "!src/test/**",
    // Ambient module declarations only -- no executable code.
    "!src/types/**",
    // Real entry point (renders into the DOM), same category as every other
    // repo's bootstrap.tsx -- see that file's own docblock.
    "!src/bootstrap.tsx",
  ],
  // @lynkflow/config/jest/react's floor (80/85/85/85) applies unchanged --
  // no override needed yet.
};
