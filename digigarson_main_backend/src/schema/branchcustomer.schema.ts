import { object, string, number, date, array } from "yup";

const payload = {
  body: object({
    title: string().required("'title' is required"),
    address: object({
      title: string().required("adress title is required"),
      address: string().required("adress is required").min(0),
    }).required(),
    gsm_no: number().required("'gsm_no' is required."),
    description: string()
      .min(3, "description is too short - should be 3 chars minimum."),
    currency: string()
      .required("'currency' is required"),
    credit_amount: number()
      .required("'credit_amount' is required"),
  }),
};

const params = {
  params: object({
    customerId: string().required("customerId is required"),
  }),
};

export const  createBranchCustomerSchema = object({
  ...payload,
});

export const updateBranchCustomerSchema = object({
  ...params,
  ...payload,
});

export const deleteBranchCustomerSchema = object({
  ...params,
});
