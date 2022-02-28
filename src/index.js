const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const ipc = ipcMain;
const fs = require('fs');

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        transparent: true,
        autoHideMenuBar: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        },
    });
    
    mainWindow.setAlwaysOnTop(true, 'screen');
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    //   mainWindow.setIcon(path.join(__dirname, 'imgs/icon.ico'));

    ipc.on("app/close", () => {
        app.quit();
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});