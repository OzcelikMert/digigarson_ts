import mongoose from "mongoose";
import { BranchDocument, ProductDocument, TableDocument, UserDocument } from "./";

interface CheckProduct {
  id: ProductDocument["_id"];
  name: string;
  quantity: number;
  price: number;
}
interface CheckPayment {
  tickId?: string;
  type: number;
  currency: string;
  amount: number;
}

interface CheckDocument extends mongoose.Document {
  branch: BranchDocument["_id"];
  order_type: number;
  payments: CheckPayment[];
  products: CheckProduct[];
  table?: TableDocument["_id"];
  user: UserDocument["_id"];
  logs: [];
  is_it_paid: boolean;
  customer?: {
    full_name: string;
    address: { title: string; address: string };
    customer_id: string;
  };
  courier?: string;
  caseId:string;
}

const CheckSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    order_type: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    payments: { type: Array },
    products: { type: Array },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, required: true, default: new Date() },
    logs: { type: Array, default: [], required: true },
    is_it_paid: { type: Boolean, default: false, required: true },
    customer: { type: Object },
    courier: {type: String,required: false},
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
  }
);
//adisyonu bilgileirnin girilmesi için gereken modeli oluşturur.
const CheckModel = mongoose.model<CheckDocument>("Check", CheckSchema);

export {
    CheckModel,
    CheckDocument,
    CheckPayment,
    CheckProduct
};
