import { object, string, number, array } from "yup";

const payload = {
  body: object(
    {
      start_balance: array().of(object({
        type: number().required("Type is required"),
        amount: number().required("Amount is required")
      }).required()).required()
    }
  ),
};

export const createCaseSchema = object({
  ...payload,
});

