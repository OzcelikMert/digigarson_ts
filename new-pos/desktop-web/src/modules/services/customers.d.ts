interface Address{
    address: string,
    title: string
}

export interface CustomerPostParamDocument {
    currency: string,
    credit_amount: string,
    description: string,
    title: string,
    address:Address,
    gsm_no: string
}