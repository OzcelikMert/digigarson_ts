import { app, BrowserWindow, ipcMain } from 'electron';

export const initWindowEvent = (window: BrowserWindow) => {
  ipcMain.on('maximize', () => window.maximize());
  ipcMain.on('minimize', () => window.minimize());
  ipcMain.on('exit', () => app.exit());
  ipcMain.on('restart', () => (app.relaunch(), app.exit()));

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
};