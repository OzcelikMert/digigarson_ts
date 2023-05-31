

export interface ITable {
    _id: string,
    busy: false,
    cancelled_orders: any[],
    paid_orders: any[],
    order_type: number,
    options: any[],
    discount: any[],
    cover: any[],
    logs: any[],
    section: string,
    title: string,
    branch: string,
    orders: any[],
    payments: any[],
    createdAt: string,
    updatedAt: string,
    __v: number,
    log: any[],
    userId: string,
    isPrint: {
        status: boolean,
        print: boolean
    }
}