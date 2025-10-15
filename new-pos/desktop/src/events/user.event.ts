import { UserService } from '@/services/user.service';
import { SystemUtil } from '@/utils/system';
import { app, BrowserWindow, ipcMain } from 'electron';

export const initUserEvent = (window: BrowserWindow) => {
  ipcMain.handle('getToken', async () => {
    const token = await SystemUtil.createDeviceHash();
    return token;
  });

  ipcMain.handle('getUser', async (event, value) => {
    return UserService.get({ id: value });
  });

  ipcMain.handle('setUser', async (event, value) => {
    return UserService.update(value);
  });
};
