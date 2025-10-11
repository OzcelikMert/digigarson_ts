import config from 'config';
import { app, BrowserWindow } from 'electron';
//import {checkForUpdates, downloadAsar} from "./updater";
import { initWindowEvent } from '@/events/window.event';
import { initPrinterEvent } from '@/events/printer.event copy';

const url = config.get('url') as string;
const runType = config.get('runType') as string;
const isDev = runType === 'dev' ? true : false;

app.whenReady().then(() => {
  const window = new BrowserWindow({
    minWidth: 1200,
    minHeight: 800,
    autoHideMenuBar: true,
    fullscreen: !isDev,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: isDev,
    },
  });

  window.loadURL(url);

  if(isDev){
      window.webContents.openDevTools();
  }

  initWindowEvent(window);
  initPrinterEvent(window);

  if (!app.isPackaged) return;

  /*ipcMain.on('check-for-updates', (event) =>
    checkForUpdates().then((data) =>
      data
        ? downloadAsar().then((data) => event.reply('cfu-data', data))
        : event.reply('cfu-data', data)
    )
  );*/
});
