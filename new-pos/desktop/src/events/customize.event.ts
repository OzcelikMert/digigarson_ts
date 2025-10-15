import { CustomizeService } from '@/services/customize.service';
import { SystemUtil } from '@/utils/system';
import { app, BrowserWindow, ipcMain } from 'electron';

export const initCustomizeEvent = (window: BrowserWindow) => {
  ipcMain.handle('getCustomizeSettings', () => {
    return CustomizeService.get();
  });

  ipcMain.handle('setCustomizeSettings', (event, value) => {
    return CustomizeService.update(value);
  });
};