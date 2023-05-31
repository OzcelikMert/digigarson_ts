import { object, string, number, array, mixed } from "yup";

// Unit


const payload = {
  body:
    object({
      product: object({
        title: string().required("'title' is required"),
        description: string(),
        category: string().required("'category' is required"),
        branch: string(),
        options: array(),
        image: string(),
        start_time: string(),
        end_time: string(),
        stock_code: string(),
        option: array(),
        active_list: array(),
        sale_type: number().required("'sale_type' is required"),
        prices: array().of(object({
          price_name: string().required("'prices.price_name' is required"),
          currency: string().required("'prices.currency' is required"),
          order_type: array().required("'prices.order_type' is rsequired"),
          amount: number().required("'prices.amount' is required"),
          vat_rate: number().required("'prices.vat_rate' is required"),
          price: number().required("'prices.price' is required").min(0),
        }).required()).required(),
      }),
      lang: object(
        {
          locale: array().of(object(
            {
              lang: string().required("'lang' is required"),
              title: string().required("'title' is required!"),
              description: string()
            }
          ).required()).required("'locale' is required")
        }
      ).required("'lang' is required"),
    }),
};

const params = {
  params: object({
    productId: string().required("productId is required"),
  }),
};

export const createProductSchema = object({
  ...payload,
});

export const updateProductSchema = object({
  ...params,
  ...payload,
});

export const deleteProductSchema = object({
  ...params,
});
