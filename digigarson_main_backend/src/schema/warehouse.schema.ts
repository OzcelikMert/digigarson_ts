import { object, string, number, date } from "yup";

// Unit


const payload = {
  body: object({
    title: string().required("'title' is required"),
   /* nickname:string().required("'nickname' is required"),
    address: string().required("'address' is required")
    .min(10, "addres is too short - should be 10 chars minimum."),
    number: number().required("'number' is required"),
    company:string().required("'company' is required"),
    e_mail:string().email("Must be a valid email")
    .required("Email is required"),
    tax_office:string().required("'tax_office' is required"),
    identity_no:number().required("'identity_no' is required"),
    open_account_risk_limit:number().required("'open_account_risk_limit' is required"),
    fix_discount:number().required("'fix_discount' is required"),
    currency:string().required("'currency' is required"),
    opening_balance:number().required("'opening_balance' is required"),
    description: string().required("'description' is required"),
    warehouse_code: string().required("warehouse_code is required")*/
  }),
};

const params = {
  params: object({
    warehouseId: string().required("warehouseId is required"),
  }),
};

export const createWarehouseSchema = object({
  ...payload,
});

export const updateWarehouseSchema = object({
  ...params,
  ...payload,
});

export const deleteWarehouseSchema = object({
  ...params,
});
