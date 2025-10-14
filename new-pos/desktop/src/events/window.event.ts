import { app, BrowserWindow, ipcMain } from 'electron';

export const initWindowEvent = (window: BrowserWindow) => {
  ipcMain.handle('maximize', () => window.maximize());
  ipcMain.handle('minimize', () => window.minimize());
  ipcMain.handle('exit', () => app.exit());
  ipcMain.handle('restart', () => (app.relaunch(), app.exit()));
  
  ipcMain.handle('zoom', (event, zoomDirection) => {
    var currentZoom = window.webContents.getZoomFactor();
    if (zoomDirection === "in") {
        window.webContents.zoomFactor = currentZoom + 0.2;
    }
    if (zoomDirection === "out") {
        window.webContents.zoomFactor = currentZoom - 0.2;
    }
  });

  ipcMain.on('changeURL', (event, path) => {
    window.loadURL(path);
  });
};