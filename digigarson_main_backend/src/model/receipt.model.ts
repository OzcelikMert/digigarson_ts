import mongoose from "mongoose";
import { BranchDocument } from "./branch.model";

export interface Detail {
    product: string,
    quantity: number,
    quantity_type: number,
    amount: number
}


export interface ReceiptDocument extends mongoose.Document {
    branch: BranchDocument["_id"]
    title: string;
    field: Detail[]
}

const ReceiptSchema = new mongoose.Schema(
    {
        branch:{ type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
        title: { type: String, required: true },
        detail: { type: Array, required: true, default: [] },
    },
    { timestamps: true }
)
const Receipt = mongoose.model<ReceiptDocument>("receipt", ReceiptSchema);

export default Receipt;
