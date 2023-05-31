import { object, string, array } from "yup";

const payload = {
    body: object({
        payloads: array().of(
            object({
                section:string().required("Section is required"),
                table:string().required("Table is required"),
                thema:string().required("Thema is required")
            })
        ).required("payloads is required")
    }),
};

export const createQrcodeSchema = object({
    ...payload,
});
