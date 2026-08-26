import { contextBridge, ipcRenderer } from 'electron';

/** 最小化渲染层 API，不开放通用 IPC 或 Node.js 原语。 */
const desktopApi = {
  getPlatform: (): Promise<NodeJS.Platform> => ipcRenderer.invoke('app:get-platform'),
  setTheme: (theme: 'system' | 'light' | 'dark'): Promise<boolean> =>
    ipcRenderer.invoke('app:set-theme', theme),
  chooseDirectory: (): Promise<string | null> => ipcRenderer.invoke('dialog:choose-directory'),
  saveHtml: (content: string): Promise<string | null> => ipcRenderer.invoke('dialog:save-html', content),
};

contextBridge.exposeInMainWorld('desktop', desktopApi);

export type DesktopApi = typeof desktopApi;
