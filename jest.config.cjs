const react = require("@lynkflow/config/jest/react");

/** @type {import('jest').Config} */
module.exports = {
  ...react,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
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
