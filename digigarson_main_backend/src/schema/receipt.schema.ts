import { array, number, object, string } from "yup";

const payload = {
    body: object({
        title: string().required("'title' is required"),
        detail:array().of(object({
            product:string().required("'product_service' ise required"),
            amount:number().required("'amount' is required"),
            quantity: number().required("'quantity' is required"),
            quantity_type:number().required("'quantity_type' is required"),
        }).required()).required()
    })
}
const params = {
    params: object({
        receiptId: string().required("receiptId is required"),
    }),
};

export const createReceiptSchema = object({
    ...payload,
});

export const updateReceiptSchema = object({
    ...params,
    ...payload
})
export const getReceiptSchema = object({
    ...params,
});

export const deleteReceiptSchema = object({
    ...params,
});
