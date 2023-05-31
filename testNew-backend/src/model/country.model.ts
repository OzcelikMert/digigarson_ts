import mongoose from "mongoose";

interface CountryDocument extends mongoose.Document {
  name: string;
}

const CountrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  }
);




CountrySchema.index({ name: 1}, { unique: true });

//ülke seçimi yapmak için gereken yapıyı modeller.
const CountryModel = mongoose.model<CountryDocument>("Country", CountrySchema);

export {
    CountryModel,
    CountryDocument
};
