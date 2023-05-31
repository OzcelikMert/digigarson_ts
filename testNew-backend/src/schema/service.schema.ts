import { object, string, number, date} from "yup";

const payload = {
    body: object({
        branch: string().required("'branch' is required"),
        user: string().required("'user' is required"),
        serviceId: string().required("'serviceId' is required"),
        tableId:string().required("'tableId' is required")
    }),
};


const params = {
    params: object({
        serviceId: string().required("'ServiceId' not found")
    }),
};

  export const createServiceSchema = object({
    ...payload,
  });
  
  export const updateServiceSchema = object({
    ...params,
    ...payload,
  });
  