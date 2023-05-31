import { object, string, number, date, boolean } from "yup";


// Unit


const payload = {
  body: object({
    invoice_code: string().required("'invoice_code' is required"),
    invoice_no: number().required("'invoice_no' is required"),
    stock_code: string().required("'stock_code' is required"),
    title: string().required("'title' is required"),
    product_information: string().required("'product_information' is required"),
    description: string().required("'description' ise required"),
    incomingprice: number().required("'incomingprice' is required"),
    outgoingprice: number().required("'outgoingprice' is required"),
  }),
};

const params = {
  params: object({
    currentId: string().required("currentId is required"),
  }),
};

export const createCurrentSchema = object({
  ...payload,
});

export const updateCurrentSchema = object({
  ...params,
  ...payload,
});

export const deleteCurrentSchema = object({
  ...params,
});
