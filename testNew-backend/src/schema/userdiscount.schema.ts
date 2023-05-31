import { object, string, number, date} from "yup";

const payload = {
  body: object({
    discountAmount: string().required("'amount' is required"),
    key: string().required("'key' is required"),
    expirationDate: string().required("'expirationDate' is required"),
    type: string().required("'type' is required") 
  }),
};

const params = {
  params: object({
    discountId: string().required("serveId is required"),
  }),
};

export const createDiscountSchema = object({
  ...payload,
});

export const updateDiscountSchema = object({
  ...params,
  ...payload,
});

export const deleteDiscountSchema = object({
  ...params,
});
