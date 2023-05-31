import { object, string, number, date } from "yup";

// Unit


const payload = {
  body: object({
    process_type: number().required("'process_type' is required"),
    amount: number().required("'amount' is required"),
    section_id: string().required("'section_id' is required"),
    description: string().required("'description' is required"),
    in_time: date().required("'_time' is required")

  }),
};

const params = {
  params: object({
    analysismoneyinflowId: string().required("analysismoneyinflowId is required"),
  }),
};

export const createAnalysisMoneyInflowSchema = object({
  ...payload,
});

export const deleteAnalysisMoneyInflowSchema = object({
  ...params,
});
