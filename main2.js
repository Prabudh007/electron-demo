const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater')
const path = require('path')
const checkDiskSpace = require('check-disk-space').default
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("did-finish-load", function(){
        // for windows
        console.log("path:", path.join(__dirname))
        checkDiskSpace('C:').then((d) => {
            console.log(d)
            // data = d
            let data={
                free: (d.free / 1073741824)+"gb",
                size: (d.size / 1073741824)+"gb"
            }
            // console.log(`free: ${d.free / 1073741824} in gb`)
            // console.log(`size: ${d.size / 1073741824} in gb`)
        mainWindow.webContents.executeJavaScript(`console.log(\`${JSON.stringify(data)}\`)`)
        })
        // mainWindow.webContents.executeJavaScript(`displayFreeDiskSpace(${data})`);
        mainWindow.webContents.executeJavaScript(`console.log(\`path: ${JSON.stringify(path.join(__dirname))}\`)`)
    })
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
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
ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});
autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.executeJavaScript(`console.log(\`app size: ${info.files[0].size / 1048576}\`)`)
    // mainWindow.webContents.executeJavaScript(`displayFreeDiskSpace(${data})`)
    mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    console.log("downloaded")
    mainWindow.webContents.send('update_downloaded');
});