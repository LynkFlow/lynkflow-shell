// Plain-JS (not .ts) on purpose -- same call as every other LynkFlow app
// repo's webpack config; see lynkflow-mfe-template/webpack.config.mjs's file
// header for the full reasoning (this repo is on TypeScript 6, where a .ts
// config does work, but the ts-node dependency + per-invocation transpile
// isn't a trade worth making for one build-tooling file).
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import dotenv from "dotenv";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { dependencies } = require("./package.json");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { ModuleFederationPlugin } = webpack.container;

dotenv.config();

/** This app's own dev-server port. See .env.example. */
const PORT = Number(process.env.PORT ?? 3000);

/**
 * SMOKE-TEST REMOTE ONLY. See .env.example and README.md's "Federation
 * smoke test" section -- this is scratch-test-ui standing in for a real
 * domain MFE (none exists yet, .claude/rules/progress.md steps 9-11).
 * Replace/extend this `remotes` map with real entries (e.g. `users:
 * "users@..."`) as real `lynkflow-{domain}-ui` repos come online -- this is
 * the Shell's "MFE registry" architecture.md refers to; it lives here, in
 * the Shell's own config, not in a shared package.
 */
const SCRATCH_REMOTE_URL =
  process.env.SCRATCH_REMOTE_URL ?? "http://localhost:3001/remoteEntry.js";

/**
 * The auth-ui MFE -- pre-session screens (login, signup, forgot/reset
 * password, activate account). A real domain remote, not a smoke test.
 * See .claude/rules/auth.md's 14 Aug 2026 entry for why auth lives in its
 * own MFE rather than the Shell. Mounted at /auth/* in src/App.tsx.
 */
const AUTH_REMOTE_URL =
  process.env.AUTH_REMOTE_URL ?? "http://localhost:3002/remoteEntry.js";

export default (_env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.ts",
    mode: argv.mode ?? "development",
    devtool: isProduction ? "source-map" : "eval-source-map",
    output: {
      // The Shell is always served from the app root, unlike an MFE (which
      // can be mounted at any path by whatever's hosting it) -- so a fixed
      // publicPath is correct here, where every MFE instead uses "auto".
      publicPath: "/",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          // This app's OWN Tailwind source.
          test: /\.css$/,
          exclude: /node_modules/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          // Already-compiled CSS from a dependency -- @lynkflow/ui-kit's
          // styles.css above all. Must NOT go through postcss-loader; see
          // .claude/rules/ui-kit.md's "Two build-side requirements" section
          // for the full incident writeup this split exists to avoid.
          test: /\.css$/,
          include: /node_modules/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "shell",
        // The Shell doesn't expose anything of its own -- nothing federates
        // INTO the Shell (yet), so there's no `exposes`/`filename` here,
        // unlike every MFE's config.
        remotes: {
          scratch: `scratch@${SCRATCH_REMOTE_URL}`,
          auth: `auth@${AUTH_REMOTE_URL}`,
        },
        shared: {
          // Exactly the three singletons architecture.md mandates -- not a
          // superset. A query library, if a future MFE needs one, is that
          // MFE's own singleton declaration; the Shell doesn't need to
          // pre-declare a library it never imports itself.
          react: { singleton: true, requiredVersion: dependencies.react },
          "react-dom": {
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
          "react-router-dom": {
            singleton: true,
            requiredVersion: dependencies["react-router-dom"],
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],
    devServer: {
      port: PORT,
      historyApiFallback: true,
      // Same rationale as every MFE's webpack config: HMR + the Module
      // Federation container runtime + CSS-importing modules have a known
      // bad interaction. Full-page reload on save, not preserved state.
      hot: false,
      liveReload: true,
      headers: { "Access-Control-Allow-Origin": "*" },
    },
    watchOptions: {
      // Same reasoning as every MFE's webpack config -- native FS events
      // aren't reliable on every drive/setup; polling trades a small
      // constant CPU cost for actually detecting saves.
      poll: 1000,
    },
    optimization: {
      runtimeChunk: false,
    },
  };
};
