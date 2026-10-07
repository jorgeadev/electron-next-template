// Electron main process for Next.js + Electron
// - In dev, it loads the Next.js dev server (http://localhost:3000)
// - In prod, it serves the statically exported Next.js build from ./out
//   through a privileged custom protocol instead of file://

import { app, BrowserWindow, ipcMain, net, protocol, session, shell } from "electron";
import { existsSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ID = "com.example.todoelectron";
const APP_SCHEME = "app";
const APP_HOST = "bundle";
const APP_ORIGIN = `${APP_SCHEME}://${APP_HOST}`;
const OUT_DIR = join(__dirname, "..", "out");
const DEV_SERVER_URL = process.env.ELECTRON_RENDERER_URL ?? "http://localhost:3000";
const DEV_SERVER_ORIGIN = new URL(DEV_SERVER_URL).origin;
const CONTENT_SECURITY_POLICY = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data:",
	"font-src 'self' data:",
	"connect-src 'self'",
	"object-src 'none'",
	"base-uri 'none'",
	"form-action 'none'",
].join("; ");
const isDev = !app.isPackaged;

/** @type {BrowserWindow | null} */
let mainWindow = null;

protocol.registerSchemesAsPrivileged([
	{
		scheme: APP_SCHEME,
		privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true },
	},
]);

function isInternalUrl(rawUrl) {
	try {
		const url = new URL(rawUrl);
		if (isDev) {
			return url.origin === DEV_SERVER_ORIGIN;
		}
		return url.protocol === `${APP_SCHEME}:` && url.host === APP_HOST;
	} catch {
		return false;
	}
}

function openExternalUrl(rawUrl) {
	let url;
	try {
		url = new URL(rawUrl);
	} catch {
		return;
	}
	if (url.protocol === "https:" || url.protocol === "http:") {
		void shell.openExternal(rawUrl);
	}
}

function resolveAssetPath(pathname) {
	try {
		const decoded = decodeURIComponent(pathname);
		if (decoded.includes("\0")) {
			return null;
		}
		const target = decoded.replace(/^\/+/, "");
		const candidates = [join(OUT_DIR, target), join(OUT_DIR, `${target}.html`), join(OUT_DIR, target, "index.html")];
		for (const candidate of candidates) {
			const candidateRelative = relative(OUT_DIR, candidate);
			if (candidateRelative.startsWith("..") || isAbsolute(candidateRelative)) {
				continue;
			}
			if (existsSync(candidate) && statSync(candidate).isFile()) {
				return candidate;
			}
		}
	} catch {
		return null;
	}
	return null;
}

async function handleAppRequest(request) {
	const { pathname } = new URL(request.url);
	const assetPath = resolveAssetPath(pathname);
	if (!assetPath) {
		return new Response("Not Found", { status: 404 });
	}
	const response = await net.fetch(pathToFileURL(assetPath).toString());
	if (!assetPath.endsWith(".html")) {
		return response;
	}
	const headers = new Headers(response.headers);
	headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
	return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function registerAppProtocol() {
	protocol.handle(APP_SCHEME, handleAppRequest);
}

function registerIpcHandlers() {
	ipcMain.handle("app:get-info", event => {
		const senderUrl = event.senderFrame?.url ?? "";
		if (!isInternalUrl(senderUrl)) {
			throw new Error("Unauthorized IPC sender");
		}
		return {
			name: app.getName(),
			version: app.getVersion(),
			platform: process.platform,
			electron: process.versions.electron,
			chrome: process.versions.chrome,
		};
	});
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 720,
		minWidth: 800,
		minHeight: 560,
		show: false,
		webPreferences: {
			preload: join(__dirname, "preload.cjs"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
			webviewTag: false,
		},
	});

	mainWindow.once("ready-to-show", () => mainWindow?.show());

	if (isDev) {
		void mainWindow.loadURL(DEV_SERVER_URL);
		mainWindow.webContents.openDevTools();
	} else {
		void mainWindow.loadURL(`${APP_ORIGIN}/index.html`);
	}

	mainWindow.webContents.on("will-navigate", (event, url) => {
		if (isInternalUrl(url)) {
			return;
		}
		event.preventDefault();
		openExternalUrl(url);
	});

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		openExternalUrl(url);
		return { action: "deny" };
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
	app.quit();
} else {
	app.on("second-instance", () => {
		if (!mainWindow) {
			return;
		}
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}
		mainWindow.focus();
	});

	app.whenReady().then(() => {
		app.setAppUserModelId(APP_ID);

		session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
		session.defaultSession.setPermissionCheckHandler(() => false);

		registerIpcHandlers();

		if (!isDev) {
			registerAppProtocol();
		}

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
}
