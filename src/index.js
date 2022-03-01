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

if (require('electron-squirrel-startup')) {
    app.quit();
}

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
            devTools: false,
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

    ipc.on("app/setcrosshaircolor", (e, value) => {
        mainWindow.webContents.send('app/setcrosshaircolor', value);
    });

    ipc.on("app/toggleSettingsMenu", (e, value) => {
        value ? settingsMenu.restore() : settingsMenu.minimize();
    });

    ipc.on("app/setlines", (e, value) => {
        mainWindow.webContents.send('app/setlines', value);
    });

    ipc.on("app/setdot", (e, value) => {
        mainWindow.webContents.send('app/setdot', value);
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