import { object, string, array, number } from "yup";


const payload = {
    body: object({
        branch: string().required("Branch is required."),
        payment: array().required("Payment must be valid."),
        sales_amount: array().required("Enter the sale price")
    }),
  };
  
  const params = {
    params: object({
      branchId: string().required("branchId is required"),
    }),
  };


export const createBranchPaymentSchema = object({
    ...payload,
  });
  
  export const updateBranchPaymentSchema = object({
    ...params,
    ...payload,
  });