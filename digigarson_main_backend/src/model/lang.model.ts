import mongoose from "mongoose";
import { array } from "yup";
import { number, string } from "yup/lib/locale";
import {BranchDocument} from "./branch.model";


export interface localeDocument{
    lang: string;
    title: string;
    description?: string;
};

export interface itemsDocument{
    itemId: string;
    type: number;
    locale: localeDocument[];
};

export interface LangDocument extends mongoose.Document {
    branch: BranchDocument["_id"];
    items?: itemsDocument[];
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

const Lang = mongoose.model<LangDocument>("lang", LangSchema);

export default Lang;