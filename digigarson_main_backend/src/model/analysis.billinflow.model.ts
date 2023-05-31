import mongoose from "mongoose";
import { BranchDocument } from "./branch.model";



// Analiz bölümünde yeni senet girişi bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
export interface AnalysisBillInflowDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  amount: number;
  title: string;
  description: string;
  bill_time: number;
  type:string;
  bill:string;
  bill_no:number;
  bank:string;
  expiry_date:number;
}

const  AnalysisBillInflowSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    amount:{ type:Number, required:true },
    title: { type: String, required: true },
    bank: { type: String, required: true },
    type: { type: String, required: true },
    bill: { type: String, required: true },
    description: { type: String, required: true },
    bill_time: { type: Date, required:true },
    bill_no:{ type:Number, required:true },
    expiry_date: { type: Date, required:true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const AnalysisBillInflow = mongoose.model<AnalysisBillInflowDocument>("AnalysisBillInflow", AnalysisBillInflowSchema);

export default AnalysisBillInflow;

