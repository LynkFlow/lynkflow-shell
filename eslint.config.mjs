import react from "@lynkflow/config/eslint/react";

/**
 * Thin extends of the shared React ESLint layer. Only two things are
 * specific to this repo: the webpack DefinePlugin build global (PORT isn't
 * injected, but the smoke-test remote URL is -- see webpack.config.mjs) and
 * the jest.setup.ts default-project allowance. Everything else
 * (recommendedTypeChecked, react-hooks, .cjs/.config overrides, test-file
 * exceptions) lives in @lynkflow/config -- don't re-add it here.
 */
export default react({
  tsconfigRootDir: import.meta.dirname,
  allowDefaultProject: ["jest.setup.ts"],
});
