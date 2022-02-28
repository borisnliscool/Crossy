const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

const close = document.querySelector('#close');
close.addEventListener('click', () => {
    ipc.send('app/close');
});

const toggleCursor = document.querySelector('#togglecursor');
toggleCursor.onclick = () => {
    ipc.send("app/togglecursor");
}

const crosshairColor = document.querySelector('#crosshaircolor');
crosshairColor.onchange = () => {
    ipc.send("app/setcrosshaircolor", crosshairColor.value);
}