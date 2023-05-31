import { object, string, number, array } from "yup";

const payload = {
  body: object({
    payment_type: number().required("Payment type must be valid.")
  }),
};

const params = {
  params: object({
    tableId: string().required("TableId is required"),
  }),
};

export const createCheckSchema = object({
  ...payload,
  ...params
});



export const getCheckSchema = object({
  ...params
});

export const getOldCheckSchema = object({
  params: object({
    checkId: string().required("'checkId' is required"),
  }),
});

export const updateOldCheckSchema = object({
  params: object({
    checkId: string().required("'checkId' is required"),
  }),
  body: object({
    payments: array().of(object({
      type: number().required("payment type is required"),
      amount: number().required("payment amount is required").min(0),
      currency: string().required("payment currency is required"),
    }).required()).required()
  }),
});