import { object, string, number, date } from "yup";

// Unit


const payload = {
  body: object({
    title: string().required("'title' is required"),
    card_type:number().required("'card_type' is required"),
    company_type:number().required("'company_type' is required"),
    address: string().required("'address' is required")
    .min(10, "addres is too short - should be 10 chars minimum."),
    number: number().required("'number' is required"),
    country: string().required("'country' is required"),
    city:string().required("'city' is required"),
    district: string().required("'district' is required"),
    code:string().required("'code' is required"),
    iban_no: string().required("'iban_no' is required")
    .min(26, "iban_no is too short - should be 26 chars minimum."),
    company:string().required("'company' is required"),
    delivery_address: string().required("'delivery_address' is required")
    .min(10, "addres is too short - should be 10 chars minimum."),
    e_mail:string().email("Must be a valid email")
    .required("Email is required"),
    maturity: number().required("'maturity' is required"),
    tax_office:string().required("'tax_office' is required"),
    identity_no:number().required("'identity_no' is required"),
    open_account_risk_limit:number().required("'open_account_risk_limit' is required"),
    fix_discount:number().required("'fix_discount' is required"),
    currency:number().required("'currency' is required"),
    opening_balance:number().required("'opening_balance' is required"),
    description: string().required("'description' is required")

  }),
};

const params = {
  params: object({
    analysiscustomerId: string().required("analysiscustomerId is required"),
  }),
};

export const createAnalysisCustomerSchema = object({
  ...payload,
});

export const updateAnalysisCustomerSchema = object({
  ...params,
  ...payload,
});

export const deleteAnalysisCustomerSchema = object({
  ...params,
});
