import { object, string, number, date } from "yup";

// Unit


const payload = {
  body: object({
    title: string().required("'title' is required"),
    amount: number().required("'amount' is required"),
    description: string().required("'description' is required"),
    bill_time: date().required("'bill_time' is required"),
    type: string().required("'type' is required"),
    bill: string().required("'bill' is required"),
    bank: string().required("'bank' is required"),
    bill_no: number().required("'bill_no' is required"),
    expiry_date: date().required("'expiry_date' is required")
  }),
};

const params = {
  params: object({
    analysisbillinflowId: string().required("analysisbillinflowId is required"),
  }),
};

export const createAnalysisBillInflowSchema = object({
  ...payload,
});

export const deleteAnalysisBillInflowSchema = object({
  ...params,
});
