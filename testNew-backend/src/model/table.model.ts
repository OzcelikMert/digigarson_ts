import mongoose from "mongoose";
import { boolean} from "yup/lib/locale";
import { BranchDocument, ProductDocument, SectionDocument } from "./";

interface TableDiscount {
  type: number,
  amount: number
}


interface TableCover {
  price: number,
  quantity: number,
  title: string
}


interface TableDocument extends mongoose.Document {
  branch: BranchDocument["_id"]
  title: string;
  section: SectionDocument["_id"];
  busy: boolean;
  orders: [];
  cancelled_orders: [];
  paid_orders: [];
  payments: [];
  order_type: number;
  waiterId: string;
  userId: string;
  discount: TableDiscount[],
  cover: TableCover[],
  logs: any[],
  safeSales?: boolean 
}


interface TableOrdersDocument extends mongoose.Document {
  isPrint: Boolean,
  productId: ProductDocument["_id"];
  productName: string;
  priceId: string;
  priceName: string;
  quantity: number;
  price: number;
  optionsString: string;
  options: []
}


const PaymentsSchema = new mongoose.Schema(
  {
    amount: { type: Number, min: 0.00, required: true },
    type: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], required: true },
    currency: { type: String, enum: ["TL", "USD", "EUR"], required: true },
    tickId: {type: String, required: false}
  },
  { timestamps: true }
);
const OrdersSchema = new mongoose.Schema(
  {
    isPrint: {type: Boolean, default:false},
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    priceId: { type: String, required: true },
    priceName: { type: String, required: true },
    optionsString: { type: String, required: true, default: "" },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);



const TableSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    busy: { type: Boolean, required: true, default: false },
    isPrint: {"status": {type: boolean, default: false}, print:{type: boolean, default: false}},
    orders: [OrdersSchema],
    cancelled_orders: { type: Array, defaut: [] },
    paid_orders: { type: Array, defaut: [] },
    payments: [PaymentsSchema],
    order_type: { type: Number, enum: [0, 1, 2, 3, 4, 5], required: true, default: 0 }, ///  0 Boş masayı temsil eder
    waiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    options: { type: Array, },
    discount: { type: Array },
    cover: { type: Array },
    logs: { type: Array, default: [], required: true },
    safeSales: {type: Boolean, default: false}
  },
  { timestamps: true }
);


TableSchema.index({ title: 1, branch: 1, section: 1 }, { unique: true });

//table oluşturmak için gereken modeli oluşturur.
const TableModel = mongoose.model<TableDocument>("Table", TableSchema);

export {
    TableModel,
    TableDocument,
    TableCover,
    TableDiscount,
    TableOrdersDocument
};
