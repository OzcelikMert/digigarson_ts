; import mongoose from "mongoose";
import { BranchDocument } from "./branch.model";
import { CategoryDocument } from "./category.model";
import { OptionDocument } from "./option.model";

const slug = require('mongoose-slug-generator');

mongoose.plugin(slug)

export interface ProductDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  title: string;
  image: string;
  slug: string;
  category: CategoryDocument["_id"];
  active_list: number[];
  start_time: string;
  end_time: string;
  options: {
    option_id: string;
    is_forced_choice: boolean;
  }[];
  description: string;
  unit: number;
  sale_type: number;
  prices: {
    amount: number;
    priceName: string;
    currency: string;
    order_type: number[];
    vat_rate: number;
    price: number;
  }[];
  stock_code: string;
  favorite: boolean;
  opportunity:boolean;
}



const PriceSchema = new mongoose.Schema(
  {
    amount: { type: Number, min: 0.00, required: true },
    priceName: { type: String, required: true },
    currency: { type: String, enum: ["TL", "USD", "EUR","RUB","KWD","SAR","GBP"], required: true },
    order_type: { type: Array, required: true },
    vat_rate: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: false },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
    slug: { type: String, slug: "title" },
    prices: [PriceSchema],
    description: { type: String },
    active_list: { type: Array, default: [] },
    start_time: { type: String },
    end_time: { type: String },
    stock_code: { type: String },
    sale_type: { type: Number },
    options: { type: Array, default: [] },
    favorite: {type: Boolean, default: false},
    opportunity : {type: Boolean, default: false}
  },
  { timestamps: true }
);




ProductSchema.index({ title: 1, branch: 1, category: 1 }, { unique: true });
ProductSchema.index({ stock_code: 1, branch: 1 }, { unique: true });

//ürünleri girmek için gereken modeli oluşturduk.
const Product = mongoose.model<ProductDocument>("product", ProductSchema);



export default Product;

