import { object, string, number, date} from "yup";

const payload = {
  body: object({
    title: string().required("'title' is required"),
    description: string()
      .required("'description' is required")
      .min(10, "description is too short - should be 10 chars minimum."),
    expense_type: number(),
    expense_time: date()
      .required("'expense_time' is required"),
    currency: string()
      .required("'currency' is required"),
    expense_amount: number()
    .required("'expense_amount' is required")
  }),
};

const params = {
  params: object({
    expenseId: string().required("expenseId is required"),
  }),
};

export const createExpenseSchema = object({
  ...payload,
});

export const updateExpenseSchema = object({
  ...params,
  ...payload,
});

export const deleteExpenseSchema = object({
  ...params,
});
