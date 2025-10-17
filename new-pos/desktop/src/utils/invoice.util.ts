import pdf from 'html-pdf';
import fs from 'fs';
import { PDFUtil } from './pdf.util';
import { PrinterUtil } from './printer.util';

const print = async (params: IInvoiceCreateParamsUtil) => {
 let invoiceHeight = params.height;
      invoiceHeight = invoiceHeight ? invoiceHeight * 7 : 80;

    let dir = `./invoices/${Math.random()}.pdf`;

    const pdfStatus = await PDFUtil.create({
        dir: dir, 
        content: params.html, 
        width: "72mm", 
        height: `${invoiceHeight}mm`
    });

    if(pdfStatus){
        const printStatus = await PrinterUtil.print(dir, params.printerName);
        if(printStatus){
            await fs.unlinkSync(dir);
        }
        return printStatus;
    }

    return false;
};

export const InvoiceUtil = {
  print,
};
