export interface PrintOrderPutParamDocument {
    tableId: string,
    orderId: string[],
    status: boolean
}

export interface PrintHomeDeliveryPutParamDocument {
    checkId: string,
    orderId: string[],
    status: boolean
}