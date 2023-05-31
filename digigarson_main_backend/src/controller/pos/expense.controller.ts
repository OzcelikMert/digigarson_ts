import { get, omit } from "lodash";
import { Request, Response } from "express";
import { findOneBranch } from "../../service/branch.service";
import { findCase} from "../../service/case.service";
import { findExpenses, findExpense ,createExpense, deleteExpense} from "../../service/expense.service";
import log from "../../logger";
import { ObjectId } from 'bson'

// @desc    get Expenses
// @route   GET /v1/pos/expense
// @access  Public
//pos olarak görev yaptığı branch e giderlerin listesini gösterir.
export async function getExpenseHandler(req: Request, res: Response) {
    const userId = get(req, "user._id");
    const branchId = get(req, "user.branchId");
    const branch: any = await findOneBranch({ _id:branchId })
    const range = req.query;
    let _case: any= await findCase({ user: userId, is_open: true })
    let caseId: ObjectId = new ObjectId(_case._id);
    let expenses = await findExpenses({ branch: branchId, case: caseId }, {})

    res.setHeader("Content-Range", `expenses ${range._start}-${range._end}/${expenses.length}`);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count')
    res.setHeader('X-Total-Count', expenses.length)

    res.send(expenses.map(item => (omit(Object.assign(item, { id: item._id }), "_id"))))
}

// @desc    post Expenses
// @route   POST /v1/pos/expense
// @access  Public
//pos olarak görev yaptığı branch e giderler ekler.
export async function createExpenseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const userId = get(req, "user._id");
    let _case: any= await findCase({ user: userId, is_open: true })
    let caseId: Object = _case._id;
    try {
        let expense: any = await createExpense({ ...req.body, case: caseId, branch: branchId, user: userId})
        return res.send({ ...expense._doc, id: expense._id })
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}

// @desc    delete Expenses
// @route   delete /v1/pos/expense
// @access  Public
//pos olarak görev yaptığı branch e giderler ekler.
export async function deleteExpenseHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId");
    const expenseId = get(req.params, "expenseId");
    let query = await deleteExpense({ _id: expenseId });
    return res.sendStatus(200);
}


