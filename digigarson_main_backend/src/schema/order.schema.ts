import { object, string, number, array, boolean } from "yup";

const createPayload = {
  body: object({
    products: array().of(object({
      isFirst: boolean(),
      product: string().required("Product Id is required"),
      quantity: number().required("Quantity is required"),
      price: string().required("price is required"),
      note: string(),
      options: array(),
    }).required()).required().min(1, "Products can not be empty."),
    discountKey: string()
  }),
};

const createHomeDeliveryOrderPayload = {
  body: object({
    products: array().of(object({
      isFirst: boolean(),
      product: string().required("Product Id is required"),
      quantity: number().required("Quantity is required"),
      price: string().required("price is required"),
      note: string(),
      options: array()
    }).required()).required().min(1, "Products can not be empty."),
    user: string().required("user id is required"),
    address:number(),
    courier: string(),
    defaultPaymentType: number().required("defaultPaymentType is required")
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
    amount: number().required("Amount is required"),
    note: string().required("Note is required")
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

const updateOrderIsPrint = {
  body: object({
    orderId: array().of(string()).required("orderId is required"),
    status: boolean().required("status is required")
  }),
};

const updateOrderParams = {
  params: object({
    tableId: string().required("tableId is required"),
    orderId: string().required("orderId is required"),
  }),
};
export const tableRequired = object({
  ...createParams,
})
export const createOrderSchema = object({
  ...createPayload,
});

export const createHomeDeliveryOrderSchema = object({
  ...createHomeDeliveryOrderPayload,
});

export const updateHomeDeliveryOrderSchema = object({
  params: object({
    checkId: string().required("tableId is required"),
    courierId: string().required("orderId is required"),  })
});

export const addOrderSchema = object({
  ...createParams,
  ...createPayload,
});

export const deleteOrderSchema = object({
  ...updateOrderParams,
});

export const updateOrderSchema = object({
  ...updateOrderParams,
  ...updateOrderPayload,
});

export const updateOrderIsPrintSchema = object({
  ...createParams,
  ...updateOrderIsPrint,
});

export const applyDiscountSchema = object({
  ...applyDiscount
})

export const applyCoverSchema = object({
  ...applyCover
})