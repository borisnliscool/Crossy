const { ipcRenderer } = require('electron');

const cursor = document.querySelector('.crosshair-inner');

ipcRenderer.on("app/setcursordisplay", (e, value) => {
    cursor.style.display = value ? "block" : "none";
});

ipcRenderer.on("app/setcrosshaircolor", (e, value) => {
    let root = document.documentElement;
    root.style.setProperty('--main-bg-color', value);
});