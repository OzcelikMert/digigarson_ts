import { object, string, number, array } from "yup";

const payload = {
  body: object(
    {
      account_name: string().required("'account_name' is required"),
      balance: array().of(object({
        type: number().required("Type is required"),
        amount: number().required("Amount is required"),
        currency:number().required("'currency' is required")
      }).required()).required()
    }
  ),
};
const params = {
  params: object({
    analysiscaseId: string().required("analysiscaseId is required"),
  }),
};

export const createAnalysisCaseSchema = object({
  ...payload,
});


export const updateAnalysisCaseSchema = object({
  ...params,
  ...payload,
});

export const deleteAnalysisCaseSchema = object({
  ...params,
});
