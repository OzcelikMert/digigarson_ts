import mongoose from "mongoose";
import { BranchDocument } from "./";



// Analiz bölümünde yeni para girişi bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
interface AnalysisMoneyInflowDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  amount: number;
  process_type:number;
  description: string;
  section_id:string;
  in_time: number;
}

const  AnalysisMoneyInflowSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    amount:{ type:Number, required:true },
    process_type: { type: Number, required: true },
    description: { type: String, required: true },
    section_id: { type: String, required: true },
    in_time: { type: Date, required:true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const AnalysisMoneyInflowModel = mongoose.model<AnalysisMoneyInflowDocument>("AnalysisMoneyInflow", AnalysisMoneyInflowSchema);

export {
    AnalysisMoneyInflowModel,
    AnalysisMoneyInflowDocument
};

