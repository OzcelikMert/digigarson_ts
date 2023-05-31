import {object, string, number, date, array} from "yup";

const payload = {
  body: object({
    title: string().required("'title' is required"),
    detail:array().of(object({
      product:string().required("'product_service' ise required"),
      amount:number().required("'amount' is required"),
      quantity: number().required("'quantity' is required"),
      quantity_type:number().required("'quantity_type' is required"),
    }).required()).required()
  }),
};

const params = {
  params: object({
    semiIngredientId: string().required("semiIngredientId is required"),
  }),
};

export const createSemiIngredientSchema = object({
  ...payload,
});

export const updateSemiIngredientSchema = object({
  ...params,
  ...payload,
});

export const deleteSemiIngredientSchema = object({
  ...params,
});
