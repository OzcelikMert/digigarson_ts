import { BrowserWindow, ipcMain } from 'electron';
import { PrinterService } from '@/services/printer.service';
import { InvoiceUtil } from '@/utils/invoice.util';

export const initPrinterEvent = (window: BrowserWindow) => {
  ipcMain.handle('getPrinters', async (event) => {
    const printers = await window.webContents.getPrintersAsync();
    return printers;
  });

  ipcMain.handle('getPrinterSettings', async (event) => {
    return PrinterService.get();
  });

  ipcMain.handle('setPrinterSettings', async (event, value) => {
    return PrinterService.update(value);
  });

  ipcMain.handle('print', async (event, args) => {
    try {
      console.log(args);
      return await InvoiceUtil.print({
        printerName: args.printerName,
        height: args.data.height ?? 80,
        width: args.data.width ?? 72,
        html: args.data.html,
      });
    } catch (error) {
      console.error('Print handler error:', error);
      return false;
    }
  });

  ipcMain.handle('multiPrint', async (event, args) => {
    try {
      const printItems = Array.isArray(args) ? args : [args];
      const results = [];

      for (const item of printItems) {
        try {
          const status = await InvoiceUtil.print({
            printerName: item.printerName,
            height: item.data.height ?? 80,
            width: item.data.width ?? 72,
            html: item.data.html,
          });

          results.push({ success: status, printer: item.printerName });
        } catch (error) {
          console.error('Multi-print item error:', error);
          results.push({ success: false, printer: item.printerName, error: String(error) });
        }
      }

      return {
        success: results.every((r) => r.success),
        results: results,
      };
    } catch (error) {
      console.error('Multi-print handler error:', error);
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle('viewInvoice', async (event) => {
    return false;
  });
};
