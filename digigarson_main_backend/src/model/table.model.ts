import {LargeNumberLike} from "crypto";
import mongoose from "mongoose";
import {boolean, number, string, array} from "yup/lib/locale";
import {BranchDocument} from "./branch.model";
import Product, {ProductDocument} from "./product.model";
import {SectionDocument} from "./section.model";


export interface Discount {
    type: number,
    amount: number,
    note: string
}


export interface Cover {
    price: number,
    quantity: number,
    title: string
}

export interface TableIsPrintDocument {
    status: boolean,
    print: boolean
}


export interface TableDocument extends mongoose.Document {
    branch: BranchDocument["_id"]
    title: string;
    section: SectionDocument["_id"];
    isPrint: TableIsPrintDocument,
    busy: boolean;
    orders: any[];
    totalPrice: number;
    cancelled_orders: any[];
    paid_orders: any[];
    payments: any[];
    order_type: number;
    waiterId: string;
    userId: string;
    discount: Discount[],
    cover: Cover[],
    logs: any[],
    isSafeSales: boolean
    isHomeDeliverySales: boolean
}


export interface OrdersDocument extends mongoose.Document {
    isPrint: Boolean,
    isDeleted: boolean,
    isFirst: boolean
    productId: ProductDocument["_id"];
    productName: string;
    priceId: string;
    priceName?: string;
    quantity: number;
    price: number;
    optionsString: string;
    note: string;
    options: []
}


const PaymentsSchema = new mongoose.Schema(
    {
        amount: {type: Number, min: 0.00, required: true},
        type: {type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], required: true},
        currency: {type: String, enum: ["TL", "USD", "EUR"], required: true},
        tickId: {type: String, required: false}
    },
    {timestamps: true}
);
export const OrdersSchema = new mongoose.Schema(
    {
        isPrint: {type: Boolean, default: false},
        isDeleted: {type: Boolean, default: false},
        isFirst: {type: Boolean, default: false},
        productId: {type: mongoose.Schema.Types.ObjectId, ref: "product", required: true},
        productName: {type: String, required: true},
        priceId: {type: String, required: true},
        priceName: {type: String},
        optionsString: {type: String, default: ""},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        note: {type: String},
        options: [
            {
                option_id: {type: String, ref: 'option'},
                items: [{item_id: {type: String}, price: {type: Number}}]
            }
        ]
    },
    {timestamps: true}
);


const TableSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        branch: {type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true},
        section: {type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true},
        busy: {type: Boolean, required: true, default: false},
        isPrint: {"status": {type: boolean, default: false}, print: {type: boolean, default: false}},
        totalPrice: {type: Number, default: 0},
        orders: [OrdersSchema],
        cancelled_orders: {type: Array, defaut: []},
        paid_orders: {type: Array, defaut: []},
        payments: [PaymentsSchema],
        order_type: {type: Number, enum: [0, 1, 2, 3, 4, 5], required: true, default: 0}, ///  0 Boş masayı temsil eder
        waiterId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        options: {type: Array},
        discount: {type: Array},
        cover: {type: Array},
        logs: {type: Array, default: [], required: true},
        isSafeSales: {type: Boolean, default: false},
        isHomeDeliverySales: {type: Boolean, default: false}
    },
    {timestamps: true}
);


TableSchema.index({title: 1, branch: 1, section: 1}, {unique: true});

//table oluşturmak için gereken modeli oluşturur.
const Table = mongoose.model<TableDocument>("Table", TableSchema);

export default Table;
