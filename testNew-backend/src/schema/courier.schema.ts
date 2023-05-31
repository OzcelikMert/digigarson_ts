import { object, string, number } from "yup";


// Unit


const payload = {
  body: object({
    title: string().required("'title' is required"),
    number: number().required("'courier_number' is required"),
    
  }),
};

const params = {
  params: object({
    courierId: string().required("courierId is required"),
  }),
};

export const createCourierSchema = object({
  ...payload,
});

export const updateCourierSchema = object({
  ...params,
  ...payload,
});

export const deleteCourierSchema = object({
  ...params,
});

export const getCourierSchema = object({
  ...params,
});