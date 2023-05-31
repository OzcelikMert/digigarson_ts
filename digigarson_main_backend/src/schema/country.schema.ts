import { object, string } from "yup";

const payload = {
  body: object({
    name: string().required("Name is required")
  }),
};

export const createCountrySchema = object({
  ...payload,
});
