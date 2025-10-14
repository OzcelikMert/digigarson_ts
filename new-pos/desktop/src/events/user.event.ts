import { SystemUtil } from '@/utils/system';
import { app, BrowserWindow, ipcMain } from 'electron';

export const initUserEvent = (window: BrowserWindow) => {
  ipcMain.handle('getToken', async () => {
    const token = await SystemUtil.createDeviceHash();
    return token;
  });
};