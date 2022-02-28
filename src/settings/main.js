const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

const close = document.querySelector('#close');
close.addEventListener('click', () => {
    ipc.send('app/close');
});