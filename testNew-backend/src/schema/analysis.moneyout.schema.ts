import { object, string, number, date } from "yup";

// Unit


const payload = {
  body: object({
    process_type: number().required("'process_type' is required"),
    amount: number().required("'amount' is required"),
    section_id: string().required("'section_id' is required"),
    description: string().required("'description' is required"),
    out_time: date().required("'out_time' is required")

  }),
};

const params = {
  params: object({
    analysismoneyoutId: string().required("analysismoneyoutId is required"),
  }),
};

export const createAnalysisMoneyOutSchema = object({
  ...payload,
});

export const deleteAnalysisMoneyOutSchema = object({
  ...params,
});
