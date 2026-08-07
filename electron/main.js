const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

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
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
