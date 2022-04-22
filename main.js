const { app, BrowserWindow, ipcMain } = require('electron');
const updater = require('./updater')

let mainWindow;

function createWindow() {
    setTimeout(() => {
        updater()
    }, 5000);

    mainWindow = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false
        },
    });
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
      })
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});