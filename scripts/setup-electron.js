const { app, BrowserWindow, dialog, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs")

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: path.join(__dirname, "../public/icon.png"),
  })

  // Load the React app
  const isDev = process.env.NODE_ENV === "development"
  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Handle file operations
ipcMain.handle("save-file", async (event, data, filename) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      defaultPath: filename,
      filters: [
        { name: "PDF Files", extensions: ["pdf"] },
        { name: "All Files", extensions: ["*"] },
      ],
    })

    if (filePath) {
      fs.writeFileSync(filePath, data)
      return { success: true, path: filePath }
    }

    return { success: false, error: "Save cancelled" }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const data = fs.readFileSync(filePath)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
