const { app, BrowserWindow, Menu } = require("electron");
const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");

let server;
let backendProcess;
let mainWindow;

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
    return false;
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

  return true;
}

function isBackendReady() {
  return new Promise((resolve) => {
    const request = http.get(
      "http://localhost:5051/weatherforecast",
      (response) => {
        response.resume();
        resolve(response.statusCode >= 200 && response.statusCode < 500);
      },
    );

    request.on("error", () => {
      resolve(false);
    });

    request.setTimeout(1000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function waitForBackend(maxAttempts = 30, interval = 500) {
  console.log("Esperando a que el backend esté disponible...");

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const ready = await isBackendReady();

    if (ready) {
      console.log(`Backend listo después de ${attempt} intento(s).`);
      return true;
    }

    console.log(`Backend todavía no está listo (${attempt}/${maxAttempts})...`);

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return false;
}

function createWindow() {
  mainWindow = new BrowserWindow({
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

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

app.whenReady().then(async () => {
  startBackend();

  startFrontend();

  const backendReady = await waitForBackend();

  if (!backendReady) {
    console.error("El backend no pudo iniciar correctamente.");

    const { dialog } = require("electron");

    dialog.showErrorBox(
      "Error al iniciar el sistema",
      "No se pudo iniciar el servidor del sistema. Por favor, reinicie la aplicación.",
    );

    app.quit();
    return;
  }

  createWindow();

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
