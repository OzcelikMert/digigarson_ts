import { InvoiceMainDraftVariables } from '@/constants/drafts/invoiceMainVariables';
import { readFileSync } from 'fs';
import invoiceHTML from '@assets/drafts/invoice-main.html?raw';

//const invoiceHTML = readFileSync('@assets/drafts/invoice-main.html', 'utf8');

const getInvoiceMain = (height: number, print: string) => {
  let html = invoiceHTML.replaceAll(InvoiceMainDraftVariables.HEIGHT, height.toString());
  html = html.replaceAll(InvoiceMainDraftVariables.PRINT, print);
  return html;
};

export const DraftUtil = {
  getInvoiceMain,
};
