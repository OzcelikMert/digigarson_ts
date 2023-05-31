import { object, string, number, array,boolean} from "yup";

const payload = {
  body: object({
    name: string().required("'option_name' required"),
    special_name: string().required("'option_special_name' required"),
    type: number().required("'option_type' required"),
    choose_limit: string().required("'option_choose_limit' required"),
    state: number().required("''state' required"),
    items: array().of(object({
      item_name: string().required("'items.item_name' is required"),
      price: number().min(0),
    }).required()).required()
  }),
};

const params = {
  params: object({
    optionId: string().required("optionId is required"),
  }),
};

export const createOptionSchema = object({
  ...payload,
});

export const updateOptionSchema = object({
  ...params,
  ...payload,
});

export const deleteOptionSchema = object({
  ...params,
});


