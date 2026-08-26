import { app, BrowserWindow, dialog, ipcMain, nativeTheme, shell } from 'electron';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;

/** 让 Windows 原生窗口控制按钮与渲染层主题保持一致。 */
function syncTitleBarTheme() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const dark = nativeTheme.shouldUseDarkColors;
  mainWindow.setTitleBarOverlay({
    color: dark ? '#202020' : '#f3f3f3',
    symbolColor: dark ? '#f4f4f4' : '#202020',
    height: 36,
  });
  mainWindow.setBackgroundColor(dark ? '#202020' : '#f3f3f3');
}

/** 创建应用唯一的安全窗口。 */
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 820,
    minHeight: 560,
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#202020' : '#f3f3f3',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: nativeTheme.shouldUseDarkColors ? '#202020' : '#f3f3f3',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#f4f4f4' : '#202020',
      height: 36,
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once('ready-to-show', () => {
    syncTitleBarTheme();
    mainWindow?.show();
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const currentUrl = mainWindow?.webContents.getURL();
    if (currentUrl && url !== currentUrl) event.preventDefault();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 防止多个工具箱进程同时读写本地设置和任务。
const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    ipcMain.handle('app:get-platform', () => process.platform);
    ipcMain.handle('app:set-theme', (_event, theme: 'system' | 'light' | 'dark') => {
      nativeTheme.themeSource = theme;
      syncTitleBarTheme();
      return nativeTheme.shouldUseDarkColors;
    });
    // 文件系统操作保留在可信主进程中，只通过用途明确的 IPC 命令开放。
    ipcMain.handle('dialog:choose-directory', async () => {
      const result = await dialog.showOpenDialog(mainWindow!, {
        title: '选择本地缓存目录',
        properties: ['openDirectory', 'createDirectory'],
      });
      return result.canceled ? null : (result.filePaths[0] ?? null);
    });
    ipcMain.handle('dialog:save-html', async (_event, content: string) => {
      if (typeof content !== 'string' || content.length > 20_000_000) {
        throw new Error('Invalid HTML content.');
      }
      const result = await dialog.showSaveDialog(mainWindow!, {
        title: '保存 HTML',
        defaultPath: 'document.html',
        filters: [{ name: 'HTML 文档', extensions: ['html', 'htm'] }],
      });
      if (result.canceled || !result.filePath) return null;
      await writeFile(result.filePath, content, 'utf8');
      return result.filePath;
    });
    createMainWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
