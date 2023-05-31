import { object, string } from "yup";

const payload = {
  body: object({
    name: string().required("Name is required"),
    country: string().required("Country is required"),
    city: string().required("City is required"),
  }),
};

export const createDistrictSchema = object({
  ...payload,
});
