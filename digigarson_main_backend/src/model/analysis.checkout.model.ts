import mongoose from "mongoose";
import { BranchDocument } from "./branch.model";



// Analiz bölümünde yeni çek çıkışı bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
export interface AnalysisCheckOutDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  amount: number;
  description: string;
  checkout_time: number;
  type:string;
  check:string;
  check_no:number;
  bank:string;
  section_id:string;
  expiry_date:number;
}

const  AnalysisCheckOutSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    amount:{ type:Number, required:true },
    bank: { type: String, required: true },
    section_id: { type: String, required: true },
    process_type: { type: String, required: true },
    check: { type: String, required: true },
    description: { type: String, required: true },
    checkout_time: { type: Date, required:true },
    check_no:{ type:Number, required:true },
    expiry_date: { type: Date, required:true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const AnalysisCheckOut = mongoose.model<AnalysisCheckOutDocument>("AnalysisCheckOut", AnalysisCheckOutSchema);

export default AnalysisCheckOut;

