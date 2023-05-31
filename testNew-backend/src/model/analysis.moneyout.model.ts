import mongoose from "mongoose";
import { BranchDocument } from "./";



// Analiz bölümünde yeni para çıkışı bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
interface AnalysisMoneyOutDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  amount: number;
  process_type:number;
  description: string;
  section_id:string;
  out_time: number;
}

const  AnalysisMoneyOutSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    amount:{ type:Number, required:true },
    section_id: { type: String, required: true },
    process_type: { type: Number, required: true },
    description: { type: String, required: true },
    out_time: { type: Date, required:true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const AnalysisMoneyOutModel = mongoose.model<AnalysisMoneyOutDocument>("AnalysisMoneyOut", AnalysisMoneyOutSchema);

export {
    AnalysisMoneyOutModel,
    AnalysisMoneyOutDocument
};

