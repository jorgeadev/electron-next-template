// Preload script (isolated world)
// Exposes a minimal, safe API if needed in the future
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Example: no-op placeholder to keep preload structure ready
});

