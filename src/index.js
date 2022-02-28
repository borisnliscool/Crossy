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
    //   mainWindow.setIcon(path.join(__dirname, 'imgs/icon.ico'));
};

let settingsMenu = null;

function CreateOptionsMenu() {
    settingsMenu = new BrowserWindow({
        width: 400,
        height: 500,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
            devTools: false,
        },
    });

    settingsMenu.loadFile(path.join(__dirname, '/settings/index.html'));

    ipc.on("app/close", () => {
        if (settingsMenu) {
            settingsMenu.close();
            settingsMenu = null;
        }
    });
}

app.on('ready', async () => {
    await createWindow();

    const settingsMenuKey = globalShortcut.register('CommandOrControl+Shift+F11', () => {
        if (settingsMenu) {
            settingsMenu.close();
            settingsMenu = null;
        } else {
            CreateOptionsMenu();
        }
    });

    if (!settingsMenuKey) {
        console.log('registration failed')
    }

    let cursorVisible = true;

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
    }
});