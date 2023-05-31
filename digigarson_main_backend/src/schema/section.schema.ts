import { object, string, array } from "yup";

const payload = {
  body: object({
    title: string().required("Title is required"),
    /*lang: array().of(object(
      {
        sectionId: string().required("'sectionId' is required!"),
        locale: array().of(object(
          {
            lang: string().required("'lang' is required"),
            title: string().required("'title' is required!"),
          }
        ).required()).required("'locale' is required")
      }
      ).nullable()),*/
  }),
};

const params = {
  params: object({
    sectionId: string().required("sectionId is required"),
  }),
};

export const createSectionSchema = object({
  ...payload,
});

export const updateSectionSchema = object({
  ...params,
  ...payload,
});

export const deleteSectionSchema = object({
  ...params,
});
