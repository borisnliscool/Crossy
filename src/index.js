const electron = require('electron')
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem
} = electron;
const path = require('path');
const ipc = ipcMain;
const fs = require('fs');

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = async isShadowWindow => {
    const {
        width,
        height
    } = electron.screen.getPrimaryDisplay().workAreaSize

    const mainWindow = new BrowserWindow({
        useContentSize: true,
        width: width,
        height: height,
        frame: false,
        transparent: true,
        center: true,
        alwaysOnTop: true,
        acceptFirstMouse: true,
        autoHideMenuBar: true,
        hasShadow: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
            devTools: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.setIgnoreMouseEvents(true);
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