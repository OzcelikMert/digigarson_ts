export interface CheckGetParamDocument {
    tableId?: string,
    checkId?: string,
}

export interface CheckPostParamDocument {
    tableId: string
    orders: {
        id: string,
        quantity: number
    }[],
    payments: {
        type: number,
        amount: number,
        currency: string
    }[]
}

export interface CheckPutParamDocument {
    checkId: string,
    payments: {
        type: number,
        amount: number,
        currency: string
    }[]
}