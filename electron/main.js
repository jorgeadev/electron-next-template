// Electron main process for Next.js + Electron
// - In dev, it loads http://localhost:3000
// - In prod, it loads the statically exported Next.js build from ./out

import { app, BrowserWindow, shell } from "electron";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 720,
		webPreferences: {
			preload: join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
		},
		show: false,
	});

	mainWindow.once("ready-to-show", () => mainWindow && mainWindow.show());

	if (isDev) {
		mainWindow.loadURL("http://localhost:3000");
		mainWindow.webContents.openDevTools();
	} else {
		const indexPath = join(__dirname, "..", "out", "index.html");
		mainWindow.loadFile(indexPath);
	}

	// Open external links in default browser
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: "deny" };
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
