import { object, number, string } from "yup";

const payload = {
    body: object({
        phone: number().required("'phone' is required")
    })
}

const params = {
    params: object({
        callerId: string().required("'callerId' is required")
    })
}

export const createCallerSchema = object({
    ...payload
  });

export const callerIdSchema = object({
    ...params
})

export const updateCallerSchema = object({
    ...payload, ...params
})