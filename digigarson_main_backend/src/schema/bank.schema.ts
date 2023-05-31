import { object, string, number, array } from "yup";

const payload = {
  body: object(
    {
      account_name: string().required("'account_name' is required"),
      bank_name:string().required("'bank_name' is required"),
      iban_no: string().required("'iban_no' is required")
      .min(26, "iban_no is too short - should be 26 chars minimum."),
      bank_branch:string().required("'bank_branch' is required"),
      account_number:number().required("'account_number' is required"),
      balance: array().of(object({
        type: number().required("Type is required"),
        amount: number().required("Amount is required"),
          currency:number().required("'currency' is required"),
      }).required()).required()
    }
  ),
};


export const createBankSchema = object({
  ...payload,
});

