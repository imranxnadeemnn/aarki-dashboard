const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backendProcess;

function startBackend() {
    backendProcess = spawn("node", ["backend/server.js"], {
        shell: true
    });

    backendProcess.stdout.on("data", (data) => {
        console.log(`Backend: ${data}`);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800
    });

    win.loadFile(path.join(__dirname, "frontend/dist/index.html"));
}

app.whenReady().then(() => {
    startBackend();

    setTimeout(() => {
        createWindow();
    }, 2000); // wait for backend
});

app.on("will-quit", () => {
    if (backendProcess) backendProcess.kill();
});