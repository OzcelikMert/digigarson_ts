export type AppGlobalGetState = {
    globalData: {
        caseId: string,
        Categories: any[]
        Products: any[]
        ProductOptions: any[]
        AllTables: any[]
        Sections: any[]
        Ticks: any[]
        AllCourier: any[]
        AllCustomers: any[]
        AllTakeaway: any[]
    }
}

export type AppGlobalSetState = {
    globalData: {
        caseId?: string,
        Categories?: any[]
        Products?: any[]
        ProductOptions?: any[]
        AllTables?: any[]
        Sections?: any[]
        Ticks?: any[]
        AllCourier?: any[]
        AllCustomers?: any[]
        AllTakeaway?: any[]
    }
}