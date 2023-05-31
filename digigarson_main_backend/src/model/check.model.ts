import mongoose from "mongoose";
import {BranchDocument} from "./branch.model";
import Product, {ProductDocument} from "./product.model";
import {OrdersDocument, TableDocument, OrdersSchema, Cover, Discount} from "./table.model";
import {UserDocument} from "./user.model";

interface product {
    id: ProductDocument["_id"];
    name: string;
    quantity: number;
    price: number;
}

export interface payment {
    tickId?: string;
    type: number;
    currency: string;
    amount: number;
}

export interface CheckDocument extends mongoose.Document {
    branch: BranchDocument["_id"];
    order_type: number;
    cover: Cover[];
    discount: Discount[];
    payments: payment[];
    products: OrdersDocument[];
    table?: TableDocument["_id"];
    user: UserDocument["_id"];
    logs: [];
    is_it_paid: boolean;
    defaultPaymentType?: number;
    customer?: {
        full_name: string;
        address: { title: string; address: string };
        customer_id: string;
    };
    courier?: string;
    caseId: string;
}

const CheckSchema = new mongoose.Schema(
    {
        branch: {type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true},
        order_type: {type: Number, enum: [0, 1, 2, 3, 4, 5], required: true},
        cover: {type: Array, default: []},
        discount: {type: Array, default: []},
        payments: {type: Array, default: []},
        products: [OrdersSchema],
        table: {type: mongoose.Schema.Types.ObjectId, ref: "Table"},
        user: {type: mongoose.Schema.Types.ObjectId, required: true},
        createdAt: {type: Date, required: true, default: new Date()},
        logs: {type: Array, default: [], required: true},
        is_it_paid: {type: Boolean, default: false, required: true},
        defaultPaymentType: {type: Number},
        customer: {type: Object},
        courier: {type: String, required: false},
        caseId: {type: mongoose.Schema.Types.ObjectId, ref: "Case"},
    }
);
//adisyonu bilgileirnin girilmesi için gereken modeli oluşturur.
const Check = mongoose.model<CheckDocument>("Check", CheckSchema);

export default Check;
