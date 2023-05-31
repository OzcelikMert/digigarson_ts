import mongoose from "mongoose";
import { BranchDocument, UserDocument } from "./";

interface AnalysisCaseBalance {
  type: number,
  amount: number;
  currency: number;
}


interface AnalysisCaseDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  user: UserDocument["_id"];
  balance: AnalysisCaseBalance[];
  account_name:string;
}

const AnalysisCaseSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Array, required: true },
    account_name:{ type: String, required: true },

  },
  { timestamps: true }
);
//kasa için gereken modeli oluşturarak bilgilerin girileceği ortamı oluşturur.
const AnalysisCaseModel = mongoose.model<AnalysisCaseDocument>("AnalysisCase", AnalysisCaseSchema);

export {
    AnalysisCaseModel,
    AnalysisCaseDocument,
    AnalysisCaseBalance
};
