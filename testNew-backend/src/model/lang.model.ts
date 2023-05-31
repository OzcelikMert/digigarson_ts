import mongoose from "mongoose";
import { BranchDocument } from "./";


interface LangLocaleDocument{
    lang: string;
    title: string;
    description?: string;
};

interface LangItemsDocument{
    itemId: string;
    type: number;
    locale: LangLocaleDocument[];
};

interface LangDocument extends mongoose.Document {
    branch: BranchDocument["_id"];
    items?: LangItemsDocument[];
};

const localeSchema = new mongoose.Schema({
    lang: {type: String, required: true, default: true},
    title: {type: String, required: true},
    description: {type: String, required: false}
})

const itemsSchema = new mongoose.Schema({
    itemId: {type: String, required: true},
    type:{type: Number, enum : [1,2,3,4,5], required: true},
    locale: [localeSchema]
})


const LangSchema = new mongoose.Schema({
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    items: [itemsSchema]
})

const LangModel = mongoose.model<LangDocument>("lang", LangSchema);

export {
    LangModel,
    LangDocument,
};