export default {
  "*.{ts,tsx,js,jsx,mjs,cjs,json,md,css}": ["prettier --write"],

  // The coverage step (test:coverage:warn) is advisory, not a gate -- see
  // the matching comment in lynkflow-ui-kit's lint-staged.config.mjs for the
  // full reasoning (Jest's exit code can't distinguish "a test failed" from
  // "coverage dipped"). --findRelatedTests above still blocks on a real
  // regression in what changed.
  "*.{ts,tsx}": (stagedFiles) => [
    `eslint --max-warnings=0 ${stagedFiles.map((f) => `"${f}"`).join(" ")}`,
    `jest --bail --findRelatedTests --passWithNoTests ${stagedFiles.map((f) => `"${f}"`).join(" ")}`,
    "tsc --noEmit",
    "npm run test:coverage:warn",
  ],
};
