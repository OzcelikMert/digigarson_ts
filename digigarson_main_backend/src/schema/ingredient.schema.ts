import { object, string, number, date} from "yup";

const payload = {
  body: object({
    title: string().required("'title' is required"),
    quantity:number().required("'quantity' is required"),
    purchase_amount: number().required("'purchase_amount' is required"),
    product_amount1: number().required("'product_amount1' is required"),
    product_amount2: number().required("'product_amount2' is required"),
    barcode:string().required("'barcode' is required"),
    modell:string().required("'modell' is required"),
    width:string().required("'width' is required"),
    height:string().required("'height' is required"),
    brand:string().required("'brand' is required"),
    desi:string().required("'desi' is required"),
    size:string().required("'size' is required"),
    weight:string().required("'weight' is required"),
    general_code:string().required("'general_code' is required"),
    description:string().required("'description' is required"),
    stock_code: string().required("'stock_code' is required"),
    warehouse_title:string().required("'warehouse_title' is required"),
  }),
};

const params = {
  params: object({
    ingredientId: string().required("ingredientId is required"),
  }),
};

export const createIngredientSchema = object({
  ...payload,
});

export const updateIngredientSchema = object({
  ...params,
  ...payload,
});

export const deleteIngredientSchema = object({
  ...params,
});
