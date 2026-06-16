import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // App info
  getVersion: () => ipcRenderer.invoke("app:version"),
  getPlatform: () => ipcRenderer.invoke("app:platform"),

  // Window controls
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),

  // File system (for future use)
  readFile: (path: string) => ipcRenderer.invoke("fs:readFile", path),
  writeFile: (path: string, data: string) =>
    ipcRenderer.invoke("fs:writeFile", path, data),

  // Notifications
  showNotification: (title: string, body: string) =>
    ipcRenderer.send("notification:show", { title, body }),
});

// Type definitions
export interface ElectronAPI {
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, data: string) => Promise<void>;
  showNotification: (title: string, body: string) => void;
}
