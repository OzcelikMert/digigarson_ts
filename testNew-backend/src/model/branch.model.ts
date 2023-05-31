import mongoose from "mongoose";
import { CountryDocument, CityDocument, DistrictDocument } from "./";

const WorkingHoursSchema = new mongoose.Schema(
  {
    day: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7], required: true },
    open_hour: { type: String, required: true },
    close_hour: { type: String, required: true },
    is_active: { type: Boolean, default: false }
  }
)


// const PaymentsTypesSchema = new mongoose.Schema(
//   {
//     payment: { types: mongoose.Schema.Types.ObjectId, ref: payment_types },
//     is_active: { types: Boolean, default: false}
//   }
// )


interface BranchIPaymentTypes {
  payments: string,
  is_active: boolean
};

const UserServicesSchema = new mongoose.Schema(
  {
    description: { type: String }
  });



//veri tabanı için gireceğimiz bilgilerin, tiplerimi beliler. bir model oluşturmamızı sağlar.
interface BranchDocument extends mongoose.Document {
  title: string;
  address: string;
  country: CountryDocument["_id"];
  city: CityDocument["_id"];
  district: DistrictDocument["_id"];
  working_hours: [];
  payment_types: BranchIPaymentTypes[];
  min_order_requirements: {
    min_time: number,
    min_amount: number
  };
  user_services: [
    {
      description: string
    }
  ];
  subBranch: [];
  manageBranch: Boolean;
  crew_quota: number;
  active: boolean;
  custom_id: boolean;
  image: string;
  getir: [{
      restaurantSecretKey: String;
      token: String;
    }]
  }

// veritabanına girdiğimiz bilgilerin nereye yazılacağını ve tiplerini, zorunluluklarını gibi detayları gireriz.
const BranchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    custom_id: { type: Number, unique: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
    district: { type: mongoose.Schema.Types.ObjectId, ref: "District" },
    address: { type: String, required: true },
    working_hours: [WorkingHoursSchema],
    payment_types: { type: Array, default: [] },
    min_order_requirements: {
      min_time: { type: Number },
      min_amount: { type: Number }
    },
    user_services: [UserServicesSchema],
    manageBranch: { type: Boolean, default: false },
    subBranch: { type: Array, default: [] },
    crew_quota: { type: Number, default: 5 },
    active: { type: Boolean, default: false },
    image: { type: String, required: false },
    getir:{ 
        restaurantSecretKey: {type: String, required: false, default: ""},
        token: {type: String, required: false, default: ""}}
  },
  { timestamps: true }
);



const BranchModel = mongoose.model<BranchDocument>("branch", BranchSchema);

export {
    BranchModel,
    BranchDocument,
    BranchIPaymentTypes
};
