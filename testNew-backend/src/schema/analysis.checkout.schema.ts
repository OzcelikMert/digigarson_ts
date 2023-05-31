import { object, string, number, date } from "yup";

// Unit


const payload = {
  body: object({
    amount: number().required("'amount' is required"),
    description: string().required("'description' is required"),
    checkout_time: date().required("'checkout_time' is required"),
    process_type: string().required("'type' is required"),
    section_id: string().required("'section_id' is required"),
    check: string().required("'check' is required"),
    bank: string().required("'bank' is required"),
    check_no: number().required("'check_no' is required"),
    expiry_date: date().required("'expiry_date' is required")

  }),
};

const params = {
  params: object({
    analysischeckoutId: string().required("analysischeckoutId is required"),
  }),
};

export const createAnalysisCheckOutSchema = object({
  ...payload,
});

export const deleteAnalysisCheckOutSchema = object({
  ...params,
});
