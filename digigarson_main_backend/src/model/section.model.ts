import mongoose from "mongoose";
import { BranchDocument } from "./branch.model";

export interface SectionDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  title: string;
}

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }
  },
  { timestamps: true }
);




SectionSchema.index({ title: 1, branch: 1 }, { unique: true });

// seçenekleri girmek için gereken model
const Section = mongoose.model<SectionDocument>("Section", SectionSchema);

export default Section;
