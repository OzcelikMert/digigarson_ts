import { object, string, boolean, array } from "yup";

const payload = {
  body: object({
    category: object({
    title: string().required("Title is required"),
    image: string(),
    is_sub_category: boolean(),
    parent_category: string()}).required("'parent_category' is required"),
    lang: object(
      {
        locale: array().of(object(
          {
            lang: string().required("'lang' is required"),
            title: string().required("'title' is required!"),
            description: string()
          }
        ).required()).required("'locale' is required")
      }
    ).required("'lang' is required"),
  }),
};

const params = {
  params: object({
    categoryId: string().required("categoryId is required"),
  }),
};

export const createCategorySchema = object({
  ...payload,
});

export const updateCategorySchema = object({
  ...params,
  ...payload,
});

export const deleteCategorySchema = object({
  ...params,
});
