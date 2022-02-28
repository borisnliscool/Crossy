const { ipcRenderer } = require('electron');
const wrapper = document.querySelector('.wrapper');

let isMenuOpen = true;
function ToggleMenu(value = !isMenuOpen) {
    isMenuOpen = value;
    ipcRenderer.send("app/toggleSettingsMenu", isMenuOpen);
}

ipcRenderer.on("app/toggle", (e, value) => {
    ToggleMenu(value);
});

const close = document.querySelector('#close');
close.addEventListener('click', () => {
    ipcRenderer.send('app/close');
});

const minimize = document.querySelector('#minimize');
minimize.addEventListener('click', () => {
    ToggleMenu(false);
});

const toggleCursor = document.querySelector('#togglecursor');
toggleCursor.onclick = () => {
    ipcRenderer.send("app/togglecursor");
}

const crosshairColor = document.querySelector('#crosshaircolor');
crosshairColor.onchange = () => {
    ipcRenderer.send("app/setcrosshaircolor", crosshairColor.value);
}