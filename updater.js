const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

// Configure log debugging
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = 'info'

// Disable auto downloading of updates
autoUpdater.autoDownload = false

// Single export to check for and apply any available updates
module.exports = () => {

    // Check for updates (GH Releases)
    autoUpdater.checkForUpdates()

    // Listen for updates found
    autoUpdater.on('update-available', () => {

        // Prompt user for download
        dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version of Readit is available. Do you want to update now?',
            buttons: ['Update', 'No']
        }).then(result => {
            let buttonIndex = result.response;
            if(buttonIndex === 0) autoUpdater.downloadUpdate()
        })
    })

    autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
        dialog.showMessageBox({
            type: "info",
            title: "Application Update",
            message: process.platform === "win32" ? releaseNotes : releaseName,
            detail: "A new version has been downloaded. Restart the application to apply the updates.",
            buttons: ["Restart", "Later"],
        }).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall();
        })
    })
}