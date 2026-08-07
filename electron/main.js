const { app, BrowserWindow, Menu } = require("electron");
const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

let server;
let backendProcess;

function startFrontend() {
  const frontend = express();

  const frontendPath = app.isPackaged
    ? path.join(process.resourcesPath, "frontend")
    : path.join(__dirname, "..", "frontend", "out");

  frontend.use(express.static(frontendPath));

  frontend.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  server = frontend.listen(3000, () => {
    console.log("Frontend iniciado en http://localhost:3000");
  });
}

function startBackend() {
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, "backend", "Calzado.API.exe")
    : path.join(__dirname, "..", "release", "backend", "Calzado.API.exe");

  if (!fs.existsSync(backendPath)) {
    console.error("No se encontró el backend:");
    console.error(backendPath);
    return;
  }

  const backendDirectory = path.dirname(backendPath);

  backendProcess = spawn(backendPath, [], {
    cwd: backendDirectory,
    windowsHide: true,
    detached: false,
    env: {
      ...process.env,
      ASPNETCORE_URLS: "http://localhost:5051",
    },
  });

  backendProcess.stdout?.on("data", (data) => {
    console.log("[Backend]", data.toString());
  });

  backendProcess.stderr?.on("data", (data) => {
    console.error("[Backend]", data.toString());
  });

  backendProcess.on("exit", (code) => {
    console.log("Backend finalizado:", code);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1280,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#F1F5F9",
    title: "Sistema de Gestión - Calzado Los Socios",
    icon: path.join(__dirname, "assets", "icon.ico"),
    webPreferences: {
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);

  win.loadURL("http://localhost:3000");

  win.once("ready-to-show", () => {
    win.show();
  });
}

app.whenReady().then(() => {
  startBackend();

  startFrontend();

  setTimeout(() => {
    createWindow();
  }, 2500);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", () => {
  if (server) {
    server.close();
  }

  if (backendProcess) {
    backendProcess.kill("SIGTERM");
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
