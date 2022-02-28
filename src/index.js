const {app, BrowserWindow, ipcMain, Menu, MenuItem} = require('electron');
const path = require('path');
const ipc = ipcMain;
const fs = require('fs');

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = async isShadowWindow => {
    const mainWindow = new BrowserWindow({
        acceptFirstMouse: true,
        alwaysOnTop: true,
        frame: false,
        hasShadow: false,
        closable: true,
        fullscreenable: false,
        maximizable: false,
        minimizable: false,
        resizable: false,
        skipTaskbar: false,
        transparent: true,
        useContentSize: true,
        // show: false,
        width: 60,
        height: 60,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
            devTools: false,
        },
    });
    
    mainWindow.setAlwaysOnTop(true, 'screen');
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    //   mainWindow.setIcon(path.join(__dirname, 'imgs/icon.ico'));

    ipc.on("app/close", () => {
        app.quit();
    });
};

app.on('ready', async () => {
    await createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow();
    }
});