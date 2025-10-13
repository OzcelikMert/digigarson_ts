import { app, BrowserWindow, ipcMain } from 'electron';

export const initWindowEvent = (window: BrowserWindow) => {
  ipcMain.on('maximize', () => window.maximize());
  ipcMain.on('minimize', () => window.minimize());
  ipcMain.on('exit', () => app.exit());
  ipcMain.on('restart', () => (app.relaunch(), app.exit()));
  
  ipcMain.on('zoom', (event, zoomDirection) => {
    var currentZoom = window.webContents.getZoomFactor();
    if (zoomDirection === "in") {
        window.webContents.zoomFactor = currentZoom + 0.2;
    }
    if (zoomDirection === "out") {
        window.webContents.zoomFactor = currentZoom - 0.2;
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
};