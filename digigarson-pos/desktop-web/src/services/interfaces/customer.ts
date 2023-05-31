

export interface ICustomer {
    address: [
        {
            address: string,
            title: string
        }
    ],
    currency: string,
    phone: string,
    credit_amount: number,
    description: string,
    title: string,
    branch: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
    id: string,
    branchName: string
}
export interface createCustomer {
    currency: string,
    credit_amount: number,
    description: string,
    title: string,
    address: address[],
    gsm_no: number
}
export interface address {
    address: string,
    title: string
}

export interface phone {
    isValid: boolean, 
    number:string, 
    country: any
}