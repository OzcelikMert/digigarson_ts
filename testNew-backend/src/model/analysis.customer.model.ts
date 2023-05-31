import mongoose from "mongoose";
import { BranchDocument } from "./";



// Fatura bölümünü oluşturmak için gereken bilgilerin girilmesi için model oluşturduk.
interface AnalysisCustomerDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  card_type:number;
  company_type:number;
  country:string;
  city:string;
  district:string;
  code:string;
  iban_no:string;
  address: string;
  maturity:number;
  number: number;
  company:string;
  delivery_address:string;
  e_mail:string;
  tax_office:string;
  identity_no:number;
  open_account_risk_limit:number;
  fix_discount:number;
  currency:number;
  opening_balance:number;
  description: string;
  
}

const  AnalysisCustomerSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    title: { type: String, required:true },
    card_type:{ type: Number, required:true },
    company_type:{ type:Number , required:true },
    address: { type: String, required:true },
    code: { type: String, required:true },
    delivery_address:{ type: String, required:true },
    country: { type: String, required:true },
    city:{ type: String, required:true },
    district: { type: String, required:true },
    maturity: { type:Number, required:true },
    iban_no: { type:String, required:true },
    number: { type:Number, required:true },
    company:{ type: String, required:true },
    e_mail:{ type: String, required:true },
    tax_office:{ type: String, required:true },
    identity_no:{ type:Number, required:true },
    open_account_risk_limit:{ type:Number, required:true },
    fix_discount:{ type:Number, required:true },
    currency:{ type: Number,  required:true },
    opening_balance:{ type:Number, required:true },
    description: { type: String, required:true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const AnalysisCustomerModel = mongoose.model<AnalysisCustomerDocument>("AnalysisCustomer", AnalysisCustomerSchema);

export {
    AnalysisCustomerModel,
    AnalysisCustomerDocument
};

