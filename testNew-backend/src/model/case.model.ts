import mongoose from "mongoose";
import { BranchDocument, UserDocument } from "./";

interface CaseBalance {
  type: number,
  amount: number;
  currency: string;
}


interface CaseDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  user: UserDocument["_id"];
  start_balance: CaseBalance[];
  balance: CaseBalance[];
  is_open: boolean;
  checks:[];
  expenses:[];
}

const CaseSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    start_balance: { type: Array, required: true },
    balance: { type: Array, required: true },
    checks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Check", required: true }],
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense", required: true }],
    is_open: { type: Boolean, required: true, default: true }
  },
  { timestamps: true }
);
//kasa içiçn gereken modeli oluşturarak bilgilerin girileceği ortamı oluşturur.
const CaseModel = mongoose.model<CaseDocument>("Case", CaseSchema);

export {
    CaseModel,
    CaseDocument,
    CaseBalance
};
