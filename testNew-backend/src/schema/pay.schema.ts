import { object, string, number, array } from "yup";

const payloadTablePayment = {
  body: object({
    orders: array().of(object({
      id: string().required("'order.id' is required, its mean order id in table."),
      quantity: number().required("'order.quantity' is required")
    }).required()).required(),
    payments: array().of(object({
      type: number().required("payment type is required"),
      amount: number().required("payment amount is required").min(0),
      currency:string().required("payment currency is required"),
    }).required()).required()
  }),
};

const paramsTablePayment = {
  params: object({
    tableId: string().required("tableId is required"),
  }),
};

export const createTablePaySchema = object({
  ...payloadTablePayment,
});

export const updateTablePaySchema = object({
  ...paramsTablePayment,
  ...payloadTablePayment,
});


const payloadCheckPayment = {
  body: object({
    payments: array().of(object({
      type: number().required("payment type is required"),
      amount: number().required("payment amount is required").min(0),
      currency:string().required("payment currency is required"),
    }).required()).required()
  }),
};

const paramsCheckPayment = {
  params: object({
    tableId: string().required("tableId is required"),
  }),
};

export const createCheckPaySchema = object({
  ...payloadCheckPayment,
});

export const updateCheckPaySchema = object({
  ...paramsCheckPayment,
  ...payloadCheckPayment,
});


