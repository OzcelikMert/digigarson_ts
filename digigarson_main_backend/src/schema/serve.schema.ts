import { object, string, number, date} from "yup";

const payload = {
  body: object({
    title: string().required("'title' is required"),
    description: string().required("'description' is required"),
   
  }),
};

const params = {
  params: object({
    serveId: string().required("serveId is required"),
  }),
};

export const createServeSchema = object({
  ...payload,
});

export const updateServeSchema = object({
  ...params,
  ...payload,
});

export const deleteServeSchema = object({
  ...params,
});
