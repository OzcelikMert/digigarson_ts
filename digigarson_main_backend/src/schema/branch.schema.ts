import { object, string, number, boolean, array } from "yup";

const payload = {
  body: object({
    title: string().required("Title is required"),
    address: string()
      .required("address is required")
      .min(5, "address is too short - should be 5 chars minimum."),
    country: string()
      .required("country is required"),
    city: string()
      .required("city is required"),
    district: string()
      .required("district is required"),
    crew_quota: number(),
    image: string(),
    active: boolean()
  }),
};

const params = {
  params: object({
    branchId: string().required("branchId is required"),
  }),
};


const working_hours = {
  body: object({
    day: string().required("Please enter a day"),
    open_hour: string().required("Please enter the open hours."),
    close_hour: string().required("Please enter the close hours."),
    is_active: boolean()
  })
}


const minimum_order_requirements = {
  body: object({
    min_time: number(),
    min_amount: number()
  })
}


const add_user_services = {
  body: object({
    service: object(
      {
        description: string()
      }
    ),
    lang: object(
      {
        locale: array().of(object(
          {
            lang: string().required("'lang' is required"),
            description: string().required("'title' is required!"),
          }
        ).required()).required("'locale' is required")

      }
    ).required("'lang' is required"),
  })
}


export const createBranchSchema = object({
  ...payload,
});

export const updateBranchSchema = object({
  ...params,
  ...payload,
});

export const deleteBranchSchema = object({
  ...params,
});


export const editWorkingSchema = object({
  ...working_hours
})


export const editMininumOrdersSchema = object({
  ...minimum_order_requirements
})


export const addUserServicesSchema = object({
  ...add_user_services
})