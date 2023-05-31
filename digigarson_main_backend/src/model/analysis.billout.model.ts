import mongoose from "mongoose";
import { BranchDocument } from "./branch.model";



// Analiz bölümünde yeni senet çıkışı bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
export interface AnalysisBillOutDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  amount: number;
  title: string;
  description: string;
  billout_time: number;
  type:string;
  bill:string;
  bill_no:number;
  bank:string;
  expiry_date:number;
}

const  AnalysisBillOutSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    amount:{ type:Number, required:true },
    title: { type: String, required: true },
    bank: { type: String, required: true },
    type: { type: String, required: true },
    bill: { type: String, required: true },
    description: { type: String, required: true },
    billout_time: { type: Date, required:true },
    bill_no:{ type:Number, required:true },
    expiry_date: { type: Date, required:true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const AnalysisBillOut = mongoose.model<AnalysisBillOutDocument>("AnalysisBillOut", AnalysisBillOutSchema);

export default AnalysisBillOut;

