import { BrowserWindow, ipcMain } from 'electron';
import ptp from 'pdf-to-printer';
import pdf from 'html-pdf';
import del from 'del';
import fs from 'fs';
import { DraftUtil } from '@/utils/draft';

export const initPrinterEvent = (window: BrowserWindow) => {
  ipcMain.on(
    'printers',
    async (event) => { event.returnValue = await window.webContents.getPrintersAsync(); return event; }
  );

  ipcMain.on('print', (event, args) => {
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
        scale: 'noscale'
        //win32: ['-print-settings "noscale"'],
    }
    
    const invoiceHTML = DraftUtil.getInvoiceMain(invoiceHeight, jsonArgs.data.map((e: { value: string; }) => e.value).join(''))

    let dir = `./invoices/${Math.random()}.pdf`;

    pdf.create(invoiceHTML, pdfOptions).toFile(dir, function (err, res) {
      if (err) return console.log(err);
      ptp.print(dir, printOptions).then(async () => {
        console.log(dir);
        await fs.unlink(dir, () => {
            del.deleteAsync(dir);
        });
      });
    });
  });
};