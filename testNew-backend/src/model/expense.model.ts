import mongoose from "mongoose";
import { BranchDocument, CaseDocument } from "./";

interface ExpenseDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  case: CaseDocument["_id"];
  description: string;
  expense_type: number;
  expense_time: number;
  currency: string;
  expense_amount: number;
}

const  ExpenseSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    case: {type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true},
    title: { type: String, required:true },
    description: { type: String, required: true },
    expense_type:{ type: Number },
    expense_time: { type: Date, required:true },
    currency: { type: String, enum: ["TL", "USD", "EUR"], required: true },
    expense_amount: { type: Number, min: 0.00, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
// giderler bölümüm oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
const ExpenseModel = mongoose.model<ExpenseDocument>("Expense", ExpenseSchema);

export {
    ExpenseModel,
    ExpenseDocument
};
