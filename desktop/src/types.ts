// This file allows TypeScript to recognize the electronAPI on window
export {};

declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>;
      getPlatform: () => Promise<string>;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      readFile: (path: string) => Promise<string>;
      writeFile: (path: string, data: string) => Promise<void>;
      showNotification: (title: string, body: string) => void;
    };
  }
}
