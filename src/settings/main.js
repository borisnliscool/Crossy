const { ipcRenderer } = require('electron');
const wrapper = document.querySelector('.wrapper');

const linesCheckbox = document.querySelector('#lines_checkbox');
const dotCheckbox = document.querySelector('#dot_checkbox');
const close = document.querySelector('#close');
const minimize = document.querySelector('#minimize');
const crosshairColor = document.querySelector('#crosshaircolor');
const toggleCursor = document.querySelector('#togglecursor');
const bringToTop = document.querySelector('#bringtotop');

let isMenuOpen = true;
function ToggleMenu(value = !isMenuOpen) {
    isMenuOpen = value;
    ipcRenderer.send("app/toggleSettingsMenu", isMenuOpen);
}

ipcRenderer.on("app/toggle", (e, value) => {
    ToggleMenu(value);
});

ipcRenderer.on("app/setcrosshaircolor", (e, value) => {
    crosshairColor.value = value; 
});

ipcRenderer.on("app/setlines", (e, value) => {
    linesCheckbox.checked = value; 
});

ipcRenderer.on("app/setdot", (e, value) => {
    dotCheckbox.checked = value; 
});

close.addEventListener('click', () => {
    ipcRenderer.send('app/close');
});

minimize.addEventListener('click', () => {
    ToggleMenu(false);
});

toggleCursor.onclick = () => {
    ipcRenderer.send("app/togglecursor");
}

bringToTop.onclick = () => {
    ipcRenderer.send("app/bringtotop");
}

crosshairColor.onchange = () => {
    ipcRenderer.send("app/setcrosshaircolor", crosshairColor.value);
}

linesCheckbox.onchange = () => {
    ipcRenderer.send("app/setlines", linesCheckbox.checked);
}

dotCheckbox.onchange = () => {
    ipcRenderer.send("app/setdot", dotCheckbox.checked);
}