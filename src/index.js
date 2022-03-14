const electron = require('electron');
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem,
    globalShortcut
} = electron;

const path = require('path');
const ipc = ipcMain;
const fs = require('fs');
const storage = require('electron-json-storage');

let mainWindow = null;

const createWindow = () => {
    const {
        width,
        height
    } = electron.screen.getPrimaryDisplay().workAreaSize

    mainWindow = new BrowserWindow({
        useContentSize: true,
        width: width,
        height: height,
        frame: false,
        transparent: true,
        center: true,
        alwaysOnTop: true,
        acceptFirstMouse: true,
        hasShadow: false,
        focusable: false,
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
    mainWindow.setIcon(path.join(__dirname, '/imgs/crossy-icon.png'));
};

let settingsMenu = null;
let cursorVisible = true;

function SaveSetting(setting, value) {
    storage.set(setting, value, function(e) {
        if (e) throw e;
    });
}

function LoadSettings() {
    storage.getAll(function (e, data) {
        if (e) throw e;
        mainWindow.webContents.send('app/setcrosshaircolor', data.crosshairColor);
        mainWindow.webContents.send('app/setlines', data.lines);
        mainWindow.webContents.send('app/setdot', data.dot);

        settingsMenu.webContents.send('app/setcrosshaircolor', data.crosshairColor);
        settingsMenu.webContents.send('app/setlines', data.lines);
        settingsMenu.webContents.send('app/setdot', data.dot);
    });
}

function CreateOptionsMenu() {
    settingsMenu = new BrowserWindow({
        width: 400, minWidth: 400,
        height: 500, minHeight: 500,
        x: 100,
        y: 50,
        frame: false,
        transparent: true,
        // alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
            // devTools: false,
        },
    });

    settingsMenu.loadFile(path.join(__dirname, '/settings/index.html'));
    settingsMenu.setIcon(path.join(__dirname, '/imgs/crossy-icon.png'));

    ipc.on("app/close", () => {
        app.quit();
    });

    ipc.on("app/togglecursor", () => {
        cursorVisible = !cursorVisible;
        mainWindow.webContents.send('app/setcursordisplay', cursorVisible);
    });

    ipc.on("app/bringtotop", () => {
        mainWindow.hide();
        mainWindow.show();
        mainWindow.focus();
    });

    ipc.on("app/toggleSettingsMenu", (e, value) => {
        value ? settingsMenu.restore() : settingsMenu.minimize();
    });

    ipc.on("app/setcrosshaircolor", (e, value) => {
        mainWindow.webContents.send('app/setcrosshaircolor', value);
        SaveSetting('crosshairColor', value);
    });

    ipc.on("app/setlines", (e, value) => {
        mainWindow.webContents.send('app/setlines', value);
        SaveSetting('lines', value);
    });

    ipc.on("app/setdot", (e, value) => {
        mainWindow.webContents.send('app/setdot', value);
        SaveSetting('dot', value);
    });

    mainWindow.webContents.on('dom-ready', () => {
        LoadSettings();
    });
}

app.on('ready', async () => {
    await createWindow();
    await CreateOptionsMenu();

    const settingsMenuKey = globalShortcut.register('CommandOrControl+Shift+F11', () => {
        settingsMenu.webContents.send('app/toggle');
    });

    if (!settingsMenuKey) {
        console.log('registration failed')
    }

    const toggleKey = globalShortcut.register('CommandOrControl+Shift+F12', () => {
        cursorVisible = !cursorVisible;
        mainWindow.webContents.send('app/setcursordisplay', cursorVisible);
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow();
        await CreateOptionsMenu();
    }
});