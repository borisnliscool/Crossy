const { ipcRenderer } = require('electron');

const cursor = document.querySelector('.crosshair-inner');

ipcRenderer.on("app/setcursordisplay", (e, value) => {
    cursor.style.display = value ? "block" : "none";
});;