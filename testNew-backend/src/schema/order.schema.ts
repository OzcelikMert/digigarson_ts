import { object, string, number, array } from "yup";

const createPayload = {
  body: object({
    products: array().of(object({
      product: string().required("Product Id is required"),
      quantity: number().required("Quantity is required"),
      price: string().required("price is required"),
      options: array(),
    }).required()).required().min(1, "Products can not be empty."),
    discountKey: string()
  }),
};

const createHomeDeliveryOrderPayload = {
  body: object({
    products: array().of(object({
      product: string().required("Product Id is required"),
      quantity: number().required("Quantity is required"),
      price: string().required("price is required"),
      options: array()
    }).required()).required().min(1, "Products can not be empty."),
    user: string().required("user id is required"),
    adress:number(),
    courier: string()
  }),
};

const createParams = {
  params: object({
    tableId: string().required("tableId is required"),
  }),
};


const applyDiscount = {
  body: object({
    type: number().required("Type is required"),
    amount: number().required("Amount is required")
  })
}


const applyCover = {
  body: object({
    price: number().required("Price is required"),
    quantity: number().required("Amount is required"),
    title: string().required("Title is required")
  })
}


const updateOrderPayload = {
  body: object({
    quantity: string().required("quantity is required"),
    price: number().required("price is required")
  }),
};

const updateOrderParams = {
  params: object({
    tableId: string().required("tableId is required"),
    orderId: string().required("orderId is required"),
  }),
};
const OrderSchema = {
  Apply: {
    Cover: object({
      ...applyCover
    }),
    Discount: object({
      ...applyDiscount
    })
  },
  HomeDelivery: {
    update: object({
        params: object({
          checkId: string().required("tableId is required"),
          courierId: string().required("orderId is required"),  })
      }),
    create: object({
      ...createHomeDeliveryOrderPayload,
    })
  },
  update: object({
    ...updateOrderParams,
    ...updateOrderPayload,
  }),
  delete: object({
    ...updateOrderParams,
  }),
  add: object({
    ...createParams,
    ...createPayload,
  }),
  create: object({
    ...createPayload,
  }),
  tableRequired: object({
    ...createParams,
  })
}
export  default OrderSchema;