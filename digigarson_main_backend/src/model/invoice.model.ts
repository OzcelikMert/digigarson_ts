import mongoose from "mongoose";
import {number, string} from "yup/lib/locale";
import {BranchDocument} from "./branch.model";




export interface detail {
    product_service:string;
    amount:number;
    quantity:number;
    vat:number;
    discount:number;
    total:number;
    quantity_type:number;
}


// Fatura bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
export interface InvoiceDocument extends mongoose.Document {
    branch: BranchDocument["_id"]
    invoice_time: number;
    invoice_code: string;
    invoice_no: number;
    customer: string;
    currency: number;
    pay_type: number;
    account_no: string;
    quantity_type:number;
    expiry_date: number;
    invoice_type: boolean;
    invoice_types: number;
    description: string;
    detail:detail[];

}

const InvoiceSchema = new mongoose.Schema(
    {
        branch: {type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true},
        invoice_time: {type: Date, required: true},
        invoice_code: {type: String, required: true},
        invoice_no: {type: Number, required: true},
        invoice_types: {type: Number, required: true},
        invoice_type: {type: Boolean, default: false},
        customer: {type: String, required: true},
        currency: {type: Number, required: true},
        pay_type: {type: Number, required: true},
        account_no: {type: String, required: true},
        expiry_date: {type: Date, required: true},
        description: {type: String, required: true},
        detail: { type: Array, required: true },
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    },
    {timestamps: true}
);

const Invoice = mongoose.model<InvoiceDocument>("Invoice", InvoiceSchema);

export default Invoice;

