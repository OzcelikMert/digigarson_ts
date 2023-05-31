export interface TakeawayPostParamDocument {
    products: {
        product: string,
        quantity: number,
        price: string,
        options: []
    }[],
    user: string,
    address: number,
    courier: string
    defaultPaymentType: number
}

export interface TakeawayPayParamDocument {
    id?: string,
    payments: {
            currency: string,
            amount: number,
            type: number
    }[]
}