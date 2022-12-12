const { app, BrowserWindow, shell, screen } = require("electron");
const path = require("node:path");
require("update-electron-app")();

if (handleSquirrelEvent()) {
    return;
}

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require("node:child_process");

    const appFolder = path.resolve(process.execPath, "..");
    const rootAtomFolder = path.resolve(appFolder, "..");
    const updateDotExe = path.resolve(path.join(rootAtomFolder, "Update.exe"));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch (error) { /* empty */ }

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
    case "--squirrel-install":
    case "--squirrel-updated":

        spawnUpdate(["--createShortcut", exeName]);

        setTimeout(app.quit, 1000);
        return true;

    case "--squirrel-uninstall":

        spawnUpdate(["--removeShortcut", exeName]);

        setTimeout(app.quit, 1000);
        return true;

    case "--squirrel-obsolete":

        app.quit();
        return true;
    }
}

function createWindow() {
    const main = new BrowserWindow({
        "title": "Kana Voice",
        "center": true,
        "width": screen.getPrimaryDisplay().workAreaSize.width / 1.2,
        "height": screen.getPrimaryDisplay().workAreaSize.height / 1.2,
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
