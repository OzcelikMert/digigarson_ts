export interface TableGetParamDocument {
    tableId?: string
}

export interface TransferTableGetParamDocument {
    from: string,
    target: string
}

export interface TablePutParamDocument {
    tableId: string,
    isPrint: {
        status?: boolean,
        print?: boolean
    }
}