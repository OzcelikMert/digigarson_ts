import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

import {
  ProductModel as Product,
  ProductDocument
} from "../model/";

//ürün ekler.
export async function createProduct(input: DocumentDefinition<ProductDocument>) {
  return Product.create(input);
}

//ürün bulur.
export function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) {
  return Product.findOne(query, {}, options);
}


//kategoriye bağlı ürünleri bulur.
export function findProductsByCategory(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) {
  return Product.find(query, {}, options);
}



// ürünleri bulur.
export function findProducts(
  query: FilterQuery<ProductDocument>,
  projection: any = {},
  options: QueryOptions = { lean: true }
) {
  return Product.find(query, projection, options);
}

//ürünleri bulur ve değişiklik yapar.
export async function findAndUpdate(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>
) {
  return Product.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  });
}
//ürün siler.
export function deleteProduct(query: FilterQuery<ProductDocument>) {
  return Product.deleteOne(query);
}

//ürün sayar.
export function countProduct(query: FilterQuery<ProductDocument>) {
  return Product.countDocuments(query);
}

//Qraktifliğini kaldır ve ya aktif eder
export function productQractive(query: FilterQuery<ProductDocument>, input: any){
  return Product.updateOne(query, {
    '$set': {"active_list": input}
  })
}