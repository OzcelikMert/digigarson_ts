import mongoose from "mongoose";
import { BranchDocument, UserDocument } from "./";

interface BranchPaymentsPayment {
  type: number;
  currency: string;
  amount: number;
  user: string
}

interface BranchPaymentsSalesAmount {
  currency: string,
  amount: number
}

interface BranchPaymentsDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  payment: BranchPaymentsPayment[],
  sales_amount: BranchPaymentsSalesAmount[]
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
const BranchPaymentsModel = mongoose.model<BranchPaymentsDocument>("branchPayments", BranchPaymentsSchema);

export {
    BranchPaymentsModel,
    BranchPaymentsDocument,
    BranchPaymentsPayment,
    BranchPaymentsSalesAmount
};
