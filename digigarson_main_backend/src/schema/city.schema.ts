import { object, string } from "yup";

const payload = {
  body: object({
    name: string().required("Name is required"),
    country: string().required("Country is required"),
  }),
};

export const createCitySchema = object({
  ...payload,
});
