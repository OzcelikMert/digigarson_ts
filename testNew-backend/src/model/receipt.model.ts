import mongoose from "mongoose";
import { BranchDocument } from "./";

interface ReceiptDetail {
    product: string,
    quantity: number,
    quantity_type: number,
    amount: number
}


interface ReceiptDocument extends mongoose.Document {
    branch: BranchDocument["_id"]
    title: string;
    field: ReceiptDetail[]
}

const ReceiptSchema = new mongoose.Schema(
    {
        branch:{ type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
        title: { type: String, required: true },
        detail: { type: Array, required: true, default: [] },
    },
    { timestamps: true }
)
const ReceiptModel = mongoose.model<ReceiptDocument>("receipt", ReceiptSchema);

export {
    ReceiptModel,
    ReceiptDocument,
    ReceiptDetail
};
