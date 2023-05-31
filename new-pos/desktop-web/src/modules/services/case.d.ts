export interface CaseGetParamDocument {
    caseId?: string
}

export interface CasePostParamDocument {
    start_balance: {
        type: 1,
        amount: number,
        currency: "TL"
    }[],
}

export interface CasePutParamDocument {
    isClose?: true
}