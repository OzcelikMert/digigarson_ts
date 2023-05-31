import mongoose from "mongoose";
import { BranchDocument } from "./branch.model";
import { UserDocument } from "./user.model";

interface payment {
  type: number;
  currency: string;
  amount: number;
  user: string
}

interface salesAmount {
  currency: string,
  amount: number
}

export interface BranchPaymentsDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  payment: payment[],
  sales_amount: salesAmount[]
}



const BranchPaymentsSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    payment: { type: Array, required: true},
    sales_amount: { type: Array, required: true}
  },
  { timestamps: true }
);

// ödeme için gereken modeli oluşturur ve gereken bağlantıları sağlar.
const BranchPayments = mongoose.model<BranchPaymentsDocument>("branchPayments", BranchPaymentsSchema);

export default BranchPayments;
