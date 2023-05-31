import { Request, Response } from "express";
import { userInfo } from "os";
import config from "config"
import { createReceipt, deleteReceipt, findOneReceipt, findReceipt, updateReceipt } from "../../service/receipt.service";
import { get } from "lodash"
import log from "../../logger";


export async function createReceiptHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId")
    try {
        const receipt = await createReceipt({ ...req.body, branch: branchId })
        res.send(receipt)
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }

}

export async function getReceiptByBranchHandler(req: Request, res: Response) {
    const branchId = get(req, "user.branchId")
    try {
        const receipt = await findReceipt({ branch: branchId })
        if (!receipt) {
            res.status(404).send("Receipt not found")
        }
        res.send(receipt)
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}

export async function getReceiptHandler(req: Request, res: Response) {
    const receiptId = get(req.params, "receiptId")
    try {
        const receipt = await findOneReceipt({ _id: receiptId })
        if (!receipt) {
            res.status(404).send("Receipt not found")
        }
        res.send(receipt)
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}

export async function updateReceiptHandler(req: Request, res: Response) {
    const receiptId = get(req.params, "receiptId")
    try {
        const receipt = await updateReceipt(
            { _id: receiptId },
            { ...req.body })
        if (!receipt) {
            res.status(404).send("Receipt not found")
        }
        res.send(receipt)
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}

export async function deleteReceiptHandler(req: Request, res: Response) {
    const receiptId = get(req.params, "receiptId")
    try {
        await deleteReceipt({ _id: receiptId })
        res.status(200).send("Successfuly deleted entry")
    } catch (e: any) {
        log.error(e)
        res.status(409).send(e.message)
    }
}