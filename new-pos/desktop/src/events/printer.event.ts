import { BrowserWindow, ipcMain } from 'electron';
import ptp from 'pdf-to-printer';
import pdf from 'html-pdf';
import del from 'del';
import fs from 'fs';
import { DraftUtil } from '@/utils/draft';
import { PrinterService } from '@/services/printer.service';

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

  ipcMain.handle('print', (event, args) => {
    const jsonArgs = JSON.parse(args);

    let invoiceHeight = jsonArgs.settings.height;
    invoiceHeight = invoiceHeight ? invoiceHeight * 7 : 80;

    const pdfOptions: pdf.CreateOptions = {
      //win32: ['-print-settings "noscale"'],
      type: 'pdf',
      height: `${invoiceHeight}mm`,
      width: '72mm',
      renderDelay: 0,
    };

    const printOptions: ptp.PrintOptions = {
      printer: jsonArgs.settings.printer,
      scale: 'noscale',
      //win32: ['-print-settings "noscale"'],
    };

    const invoiceHTML = DraftUtil.getInvoiceMain(
      invoiceHeight,
      jsonArgs.data.map((e: { value: string }) => e.value).join(''),
    );

    let dir = `./invoices/${Math.random()}.pdf`;

    pdf.create(invoiceHTML, pdfOptions).toFile(dir, function (err, res) {
      if (err) return console.log(err);
      ptp
        .print(dir, printOptions)
        .then(async () => {
          console.log(dir);
          await fs.unlink(dir, () => {
            del.deleteAsync(dir);
          });
          return true;
        })
        .catch((ptpErr) => {
          console.error(ptpErr);
        });
    });

    return false;
  });

  ipcMain.handle('multiPrint', async (event) => {
    return false;
  });

  ipcMain.handle('viewInvoice', async (event) => {
    return false;
  });
};
