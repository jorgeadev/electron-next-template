// Preload script (sandboxed, context-isolated)
// Must stay CommonJS: sandboxed preload scripts cannot use ESM imports.

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	getAppInfo: () => ipcRenderer.invoke("app:get-info"),
});
