import { object, string, number, array, boolean } from "yup";


const payload = {
  body: object({
    title: string().required("Title is required"),
    section: string().required("Section is required"),
    waiterId: string(),
    userId: string(),
    safeSales: boolean()

  }).required(),
};

const params = {
  params: object({
    tableId: string().required("tableId is required"),
    waiterId: string()
  }),
};

export const transferTableSchema = object({
  body: object({
    from: string().required("'from' is required"),
    target: string().required("'target' is required"),
  }).required()
});

export const multiTableSchema = object({
  body: object({
    floor: number().required("'floor' is required"),
    ceiling: number().required("'ceiling' is required"),
    section: string().required("'section' is required")
  }).required()
});


export const createTableSchema = object({
  ...payload,
});



export const updateTableSchema = object({
  ...params,
  ...payload,
});

export const deleteTableSchema = object({
  ...params,
});
