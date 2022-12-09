const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");

function createWindow() {
    const main = new BrowserWindow({
        "title": "Kana Voice",
        "center": true,
        "width": 800,
        "height": 600,
        "minWidth": 360,
        "minHeight": 480,
        "autoHideMenuBar": true,
        "webPreferences": {
            "preload": path.join(__dirname, "preload.js")
        }
    });

    main.removeMenu();
    main.loadFile("./view/index.html");

    function handleUrlOpen(event, url) {
        if (url.match(/^http/)) {
            event.preventDefault();
            shell.openExternal(url);
        }
    }

    main.webContents.on("will-navigate", handleUrlOpen);
    main.webContents.on("new-window", handleUrlOpen);

    //main.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
