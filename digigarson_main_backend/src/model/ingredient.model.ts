import mongoose from "mongoose";
import { number, string } from "yup/lib/locale";
import { BranchDocument } from "./branch.model";



export interface IngredientDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  quantity:number;
  purchase_amount: number;
  product_amount1: number;
  product_amount2: number;
  barcode:string;
  modell:string;
  width:string;
  height:string;
  brand:string;
  desi:string;
  size:string;
  weight:string;
  general_code:string;
  description:string;
  stock_code: number;
  warehouse_title:string;
}

const IngredientSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    title: { type: String, required: true },
    description:{ type: String, required: true },
    quantity:{ type: Number, required: true },
    purchase_amount: { type: Number, required: true },
    product_amount1: { type: Number, required: true },
    product_amount2: { type: Number, required: true },
    barcode:{ type: String, required: true },
    modell:{ type: String, required: true },
    width:{ type: String, required: true },
    height:{ type: String, required: true },
    brand:{ type: String, required: true },
    desi:{ type: String, required: true },
    size:{ type: String, required: true },
    weight:{ type: String, required: true },
    general_code:{ type: String, required: true },
    stock_code: { type: String, required: true },
    warehouse_title:{ type: String, required: true },
  },
  { timestamps: true }
);
// İçindekiler bölümüm oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.

const Ingredient = mongoose.model<IngredientDocument>("Ingredient", IngredientSchema);

export default Ingredient;
