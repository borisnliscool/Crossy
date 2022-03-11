const { ipcRenderer } = require('electron');

const cursor = document.querySelector('.crosshair-inner');

ipcRenderer.on("app/setcursordisplay", (e, value) => {
    cursor.style.display = value ? "block" : "none";
});

ipcRenderer.on("app/setcrosshaircolor", (e, value) => {
    let root = document.documentElement;
    root.style.setProperty('--main-bg-color', value);
});

const lines = document.querySelector('.crosshair-lines');
ipcRenderer.on("app/setlines", (e, value) => {
    lines.style.display = value ? "block" : "none";
});

const dot = document.querySelector('.crosshair-dot');
ipcRenderer.on("app/setdot", (e, value) => {
    dot.style.display = value ? "block" : "none";
});

ipcRenderer.send('app/ready');