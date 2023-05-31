import mongoose from "mongoose";
import { BranchDocument } from "./";

interface OptionItem {
  item_name: string;
  price: number;
}


interface OptionDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  name: string;
  special_name: string;
  type: number;
  choose_limit: number;
  state: number;
  items: OptionItem[];
}

const OptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    special_name: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    choose_limit: { type: Number, min: 1 },
    state: { type: Number, enum: [1, 2, 3], required: true },
    items: [
      {
        item_name: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
        ingredient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredients" },
        amount: { type: Number, required: true, default: 0 },
      }
    ],
    type: { type: Number, enum: [1, 2], required: true },
  },
  { timestamps: true }
);




OptionSchema.index({ name: 1, branch: 1 }, { unique: true });

//opsiyon oluşturmak için model oluşturur.
const OptionModel = mongoose.model<OptionDocument>("option", OptionSchema);

export {
    OptionModel,
    OptionDocument,
    OptionItem
};
