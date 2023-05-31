import mongoose from "mongoose";
import { number, string } from "yup/lib/locale";
import { BranchDocument } from "./branch.model";



export interface ServeDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  description: string;
}

const ServeSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    },
  { timestamps: true }
);
// İkramlar bölümüm oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
ServeSchema.index({ branch: 1,title:1 }, { unique: true });
const Serve = mongoose.model<ServeDocument>("Serve", ServeSchema);

export default Serve;
