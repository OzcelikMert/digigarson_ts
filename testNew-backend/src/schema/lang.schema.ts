import { object, string, number, array } from "yup";
const payload = {
  body: object({})
}

const params = {
  params: object({
    id: string().required("'id' is required"),
    h_type: string().required("'h_type' is required")
  }),
};

export const createLangSchema = object({
  ...payload,
});

export const updateLangSchema = object({
  ...params,
  ...payload,
});

export const deleteLangSchema = object({
  ...params,
});
