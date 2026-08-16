import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const shellDirectory = path.resolve(scriptsDirectory, "..");
const workspaceDirectory = path.dirname(shellDirectory);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

// Adjust this if your PowerShell script has a different name/location.
const dbScriptPath = path.join(scriptsDirectory, "local-db.ps1");

function startLocalDatabase() {
  if (process.platform !== "win32") {
    console.warn(
      "Skipping local PostgreSQL startup: local-db.ps1 is Windows-only. Start PostgreSQL manually on this platform.",
    );
    return;
  }

  if (!fs.existsSync(dbScriptPath)) {
    console.error(`Cannot start the LynkFlow workspace:\n\n- database script not found at ${dbScriptPath}`);
    process.exit(1);
  }

  console.log(`[postgres] starting local database via ${path.basename(dbScriptPath)}`);
  const result = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", dbScriptPath, "-Action", "start"],
    { stdio: "inherit", windowsHide: true },
  );

  if (result.error) {
    console.error(`Cannot start the LynkFlow workspace:\n\n- failed to launch local-db.ps1: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Cannot start the LynkFlow workspace:\n\n- local-db.ps1 exited with code ${result.status}`);
    process.exit(1);
  }
}

const applications = [
  {
    name: "notifications-svc",
    directory: path.join(workspaceDirectory, "notifications-svc"),
    env: { PORT: "3010", CORS_ORIGINS: "http://localhost:3000,http://localhost:3002" },
    requiresEnv: true,
  },
  {
    name: "auth-svc",
    directory: path.join(workspaceDirectory, "auth-svc"),
    env: { PORT: "4000", CORS_ORIGINS: "http://localhost:3000,http://localhost:3002" },
    requiresEnv: true,
    requiredFiles: [
      { path: ".secrets/jwt-private.pem", hint: "run npm run jwt:keys:generate in that repository" },
    ],
  },
  {
    name: "auth-ui",
    directory: path.join(workspaceDirectory, "auth-ui"),
    env: {
      MFE_NAME: "auth",
      PORT: "3002",
      API_HOST: "http://localhost:4000",
      API_VERSION: "v1",
    },
  },
  {
    name: "lynkflow-shell",
    directory: shellDirectory,
    env: { PORT: "3000", AUTH_REMOTE_URL: "http://localhost:3002/remoteEntry.js" },
  },
];

const errors = [];
for (const application of applications) {
  if (!fs.existsSync(path.join(application.directory, "package.json"))) {
    errors.push(`${application.name}: repository not found at ${application.directory}`);
  } else if (!fs.existsSync(path.join(application.directory, "node_modules"))) {
    errors.push(`${application.name}: dependencies are missing; run npm install in that repository`);
  }

  if (application.requiresEnv && !fs.existsSync(path.join(application.directory, ".env"))) {
    errors.push(
      `${application.name}: .env is missing; copy .env.example to .env and enter the real database/credential values`,
    );
  }

  for (const requiredFile of application.requiredFiles ?? []) {
    const filePath = path.join(application.directory, requiredFile.path);
    if (!fs.existsSync(filePath)) {
      errors.push(`${application.name}: ${requiredFile.path} is missing; ${requiredFile.hint}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Cannot start the LynkFlow workspace:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

startLocalDatabase();

// --- Prefixed, color-coded logging for every service -----------------------

// Cycle through a palette of ANSI colors so each service gets its own color.
const ANSI_COLORS = [
  "\x1b[36m", // cyan
  "\x1b[35m", // magenta
  "\x1b[33m", // yellow
  "\x1b[32m", // green
  "\x1b[34m", // blue
  "\x1b[91m", // bright red
];
const ANSI_RESET = "\x1b[0m";
const useColor = process.stdout.isTTY;

const longestNameLength = Math.max(...applications.map((application) => application.name.length));

function makePrefixer(name, color) {
  const label = name.padEnd(longestNameLength, " ");
  const prefix = useColor ? `${color}[${label}]${ANSI_RESET} ` : `[${label}] `;
  let buffer = "";

  return (chunk, writeStream) => {
    buffer += chunk.toString();
    const lines = buffer.split("\n");
    // Keep the last (possibly incomplete) line in the buffer.
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      writeStream.write(`${prefix}${line}\n`);
    }
  };
}

const children = applications.map((application, index) => {
  const color = ANSI_COLORS[index % ANSI_COLORS.length];
  console.log(`[${application.name}] starting in ${application.directory}`);

  const child = spawn(npmCommand, ["run", "dev"], {
    cwd: application.directory,
    env: { ...process.env, ...application.env },
    stdio: ["inherit", "pipe", "pipe"],
    windowsHide: true,
    shell: process.platform === "win32",
  });

  const handleStdout = makePrefixer(application.name, color);
  const handleStderr = makePrefixer(application.name, color);
  child.stdout.on("data", (chunk) => handleStdout(chunk, process.stdout));
  child.stderr.on("data", (chunk) => handleStderr(chunk, process.stderr));

  return child;
});

let shuttingDown = false;
function shutdown(signal, exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\nStopping LynkFlow (${signal})...`);
  for (const child of children) {
    if (!child.killed) child.kill(signal === "SIGINT" ? "SIGINT" : "SIGTERM");
  }
  setTimeout(() => process.exit(exitCode), 1_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

for (const [index, child] of children.entries()) {
  child.on("error", (error) => {
    console.error(`[${applications[index].name}] failed to start: ${error.message}`);
    shutdown("SIGTERM", 1);
  });
  child.on("exit", (code, signal) => {
    if (!shuttingDown) {
      console.error(
        `[${applications[index].name}] stopped unexpectedly (${signal ?? `exit code ${code}`})`,
      );
      shutdown("SIGTERM", code || 1);
    }
  });
}