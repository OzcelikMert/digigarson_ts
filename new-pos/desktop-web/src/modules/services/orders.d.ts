export interface OrderDeleteParamDocument {
    orderId: string,
    tableId?: string
}

export interface OrderGetParamDocument {
    tableId?: string,
}

export interface OrderPostParamDocument {
    tableId: string,
    products: {
        product: string,
        quantity: number,
        price: string,
        options: {}[]
    }[]
}

export interface OrdersPutParamDocument {
    tableId: string,
    products: {
        quantity: number,
        price: number,
        product: string,
        options: any
    }[]
}

export interface ProductOrderPutParamDocument {
    orderId: string,
    tableId: string,
    product: string,
    quantity: number,
    price: number,
    options: {}[]
}

export interface MoveOrderPutParamDocument {
    currentTable: string,
    targetTable: string,
    orderIds: any[]
}