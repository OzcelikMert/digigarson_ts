import { object, string, number, date } from "yup";

// Unit


const payload = {
  body: object({
    amount: number().required("'amount' is required"),
    description: string().required("'description' is required"),
    check_time: date().required("'check_time' is required"),
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
    analysischeckinflowId: string().required("analysischeckinflowId is required"),
  }),
};

export const createAnalysisCheckInflowSchema = object({
  ...payload,
});

export const deleteAnalysisCheckInflowSchema = object({
  ...params,
});
