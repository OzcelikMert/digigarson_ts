import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import log from "../../logger";
import { countExpense,  createExpense, deleteExpense, findAndUpdate, findExpense, findExpenses } from "../../service/expense.service";



// @desc    Create a new Expense
// @route   GET /v1/manager/expense
// @access  Private
//manager olarak görev yapan branch in içerisine yeni giderler oluşturur.
export async function createExpenseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    try {
        let expense: any = await createExpense({ ...req.body, branch: branchId, user: userId })
        return res.send({ ...expense._doc, id: expense._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}


// @desc    get Expenses
// @route   GET /v1/manager/expense
// @access  Public
//manager olarak görev yapan branch e  oluşturduğumuz giderlerin  listesini gönderir.
export async function getExpenseHandler(req: Request, res: Response) {


    const branchId = get(req, "user.branchId");
    const range = req.query
    let _mongoQuery = JSON.parse(get(req, "params._mongoQuery"))
    let _mongoOptions = JSON.parse(get(req, "params._mongoOptions"))

    let expenses = await findExpenses({ ..._mongoQuery, branch: branchId }, {}, _mongoOptions)
    const count = await countExpense({ ..._mongoQuery, branch: branchId })

    res.setHeader("Content-Range", `expenses ${range._start}-${range._end}/${count}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', count)
    res.send(expenses.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}


// @desc    get Expense By Id
// @route   GET /v1/manager/expense/:expenseId
// @access  Public
// manager olarak görev yapan branch e gider Idlerini bulup listeler.
export async function getExpenseByIdHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const expenseId = get(req.params, "expenseId");
    let expense: any = await findExpense({ branch: branchId, _id: expenseId })
    return res.send(Object.assign(expense, { id: expense._id }))
}
// @desc    put Expense by Id
// @route   PUT /v1/manager/expense/:expenseId
// @access  Private
//manager olarak görev yapan branch içerisindeki giderleri değiştirir.
export async function updateExpenseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const expenseId = get(req.params, "expenseId");

    let expense: any = await findExpense({ _id: expenseId })
    if (!expense) {
        return res.sendStatus(404);
    }

    if (String(expense.branch) != String(branchId)) {
        return res.sendStatus(403);
    }
    expense = await findAndUpdate({ _id: expenseId }, req.body)
    res.send(expense)

}


// @desc    Delete Expense by Id
// @route   DEL /v1/manager/expense/:expenseId
// @access  Private
//manager olarak görev yapan branch içerisindeki giderleri siler.
export async function deleteExpenseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id:branchId })

    const expenseId = get(req.params, "expenseId");

    let expense: any = await findExpense({ _id: expenseId })

    if (!expense) {
        return res.sendStatus(404);
    }

    if (String(expense.branch) != String(branchId)) {
        return res.sendStatus(403);
    }

    await deleteExpense({ _id: expenseId })
    res.sendStatus(200)

}