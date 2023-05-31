import { object, string, number,array, date,boolean } from "yup";


// Unit


const payload = {
  body: object({
    invoice_code: string().required("'invoice_code' is required"),
    invoice_no: number().required("'invoice_no' is required"),
    invoice_type: boolean().required("'invoice_type' is required"),
    invoice_types:number().required("'invoice_types' is required"),
    customer:string().required("'customer' is required"),
    currency:number().required("'currency' is required"),
    pay_type:number().required("'pay_type' is required"),
    invoice_time: date().required("'invoice_time' is required"),
    account_no:string().required("'account_no' is required"),
    expiry_date:date().required("'expiry_date' is required"),
    description: string().required("'description' ise required"),
    detail:array().of(object({
      product_service:string().required("'product_service' ise required"),
      amount:number().required("'amount' is required"),
      quantity: number().required("'quantity' is required"),
      vat:number().required("'VAT' is required"),
      discount:number().required("'discount' is required"),
      total:number().required("'total' is required"),
      quantity_type:number().required("'quantity_type' is required"),
    }).required()).required()
  }),
};

const params = {
  params: object({
    invoiceId: string().required("invoiceId is required"),
  }),
};

export const createInvoiceSchema = object({
  ...payload,
});

export const updateInvoiceSchema = object({
  ...params,
  ...payload,
});

export const deleteInvoiceSchema = object({
  ...params,
});
