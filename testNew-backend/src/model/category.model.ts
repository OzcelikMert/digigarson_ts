import mongoose from "mongoose";
import { BranchDocument } from "./";
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
interface CategoryDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  title: string;
  image: string;
  slug: string;
}

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: false },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    slug: { type: String, slug: "title" } ,
    is_sub_category:{type: Boolean,required:true,default:false},
    parent_category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);




CategorySchema.index({ title: 1, branch: 1 }, { unique: true });


//kategoriler için gereken modeli oluşturarak özellikleirne tiplerine göre bilgilerin girilmesi için gereken bağlantıları sağlar.
const CategoryModel = mongoose.model<CategoryDocument>("category", CategorySchema);

export {
    CategoryModel,
    CategoryDocument
};
