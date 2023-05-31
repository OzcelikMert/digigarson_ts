import { object, string, number, date } from "yup";

// Unit


const payload = {
  body: object({
    title: string().required("'title' is required"),
    amount: number().required("'amount' is required"),
    description: string().required("'description' is required"),
    billout_time: date().required("'billout_time' is required"),
    type: string().required("'type' is required"),
    bill: string().required("'bill' is required"),
    bank: string().required("'bank' is required"),
    bill_no: number().required("'bill_no' is required"),
    expiry_date: date().required("'expiry_date' is required")

  }),
};

const params = {
  params: object({
    analysisbilloutId: string().required("analysisbilloutId is required"),
  }),
};

export const createAnalysisBillOutSchema = object({
  ...payload,
});

export const deleteAnalysisBillOutSchema = object({
  ...params,
});
