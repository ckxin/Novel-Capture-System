import { app, BrowserWindow, dialog, ipcMain, shell, globalShortcut } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 900,
    webPreferences: {
      nodeIntegration: true,
	    webSecurity: false
    },
    // resizable: false
  })

  mainWindow.loadURL(winURL)
  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on("ready", () => {
  const ret = globalShortcut.register('CommandOrControl+F12', () => {
    mainWindow.webContents.openDevTools();
  })
  if (!ret) {
    console.log('registration failed')
  }
})

app.on('ready', createWindow)

app.on('web-contents-created', (e, webContents) => {
  webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
  });
});

app.on('will-quit', () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll()
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on("choose_save_dir", e => {
  dialog.showOpenDialog({
    title: "选择小说保存路径",
    defaultPath: "/",
    filters: [{name:'Txt', extensions:["txt"]}],
    properties:['openDirectory']
  }, saveDir => {
    e.sender.send('choose-finished', saveDir);
  })
})



/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
