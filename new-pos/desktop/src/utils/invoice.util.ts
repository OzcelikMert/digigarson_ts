import fs from 'fs';
import { PDFUtil } from './pdf.util';
import { PrinterUtil } from './printer.util';

const print = async (params: IInvoiceCreateParamsUtil) => {
    let dir = `./invoices/${Math.random()}.pdf`;

    const pdfStatus = await PDFUtil.create({
        dir: dir, 
        content: params.html, 
        width: `${params.width}mm`, 
        height: `${params.height}mm`
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
