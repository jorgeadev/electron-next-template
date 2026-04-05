// Preload script (isolated world)
// Exposes a minimal, safe API if needed in the future
import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
	// Example: no-op placeholder to keep preload structure ready
});
