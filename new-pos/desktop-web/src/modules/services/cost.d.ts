export interface CostDeleteParamDocument {
    expenseId: string
}

export interface CostPostParamDocument {
    expense_amount: number,
    expense_type: number,
    description: string,
    title: string
}