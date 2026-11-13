const { app, BrowserWindow, dialog, utilityProcess } = require("electron");
const fs = require("fs");
const http = require("http");
const path = require("path");

app.setName("PostPilot");

let backendProcess;
let shuttingDown = false;
let backendExited = false;
let backendExitCode;

function getBackendEntry() {
  const candidates = app.isPackaged
    ? [
        path.join(process.resourcesPath, "backend", "server.js"),
        path.join(app.getAppPath(), "backend", "server.js")
      ]
    : [path.join(__dirname, "..", "backend", "server.js")];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

function waitForBackendHealth(timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    function check() {
      if (backendExited) {
        reject(new Error(
          `The backend process exited before becoming healthy${backendExitCode === undefined ? "" : ` (code ${backendExitCode})`}.`
        ));
        return;
      }

      const request = http.get("http://127.0.0.1:5001/health", (response) => {
        response.resume();
        if (response.statusCode === 200) {
          resolve();
          return;
        }
        retry();
      });

      request.on("error", retry);
      request.setTimeout(1000, () => {
        request.destroy();
        retry();
      });
    }

    function retry() {
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error("The backend did not respond healthy within 15 seconds."));
        return;
      }
      setTimeout(check, 250);
    }

    check();
  });
}

async function startBackend() {
  const backendEntry = getBackendEntry();
  if (!backendEntry) {
    throw new Error(
      "The packaged backend was not found. Expected backend/server.js in the packaged resources."
    );
  }

  const dotenvPath = path.join(app.getPath("userData"), ".env");
  if (!fs.existsSync(dotenvPath)) {
    throw new Error(
      `The PostPilot configuration file is missing:\n${dotenvPath}\n\nCreate this file and add a DATABASE_URL value before starting PostPilot.`
    );
  }

  const backendDirectory = path.dirname(backendEntry);
  backendExited = false;
  backendExitCode = undefined;
  backendProcess = utilityProcess.fork(backendEntry, [], {
    cwd: backendDirectory,
    env: {
      ...process.env,
      DOTENV_CONFIG_PATH: dotenvPath,
      NODE_ENV: "production"
    }
  });

  backendProcess.on("exit", (code, signal) => {
    backendExited = true;
    backendExitCode = code;
    if (!shuttingDown && code !== 0) {
      console.error(`PostPilot backend exited with code ${code} (${signal || "no signal"}).`);
    }
  });

  await waitForBackendHealth();
}

function stopBackend() {
  shuttingDown = true;
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = undefined;
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "PostPilot",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  } else {
    win.loadURL("http://localhost:5173");
  }
};

app.whenReady().then(async () => {
  try {
    if (app.isPackaged) {
      await startBackend();
    }
    createWindow();
  } catch (error) {
    console.error("Could not start PostPilot:", error);
    dialog.showErrorBox("PostPilot could not start", error.message);
    app.quit();
    return;
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", stopBackend);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
