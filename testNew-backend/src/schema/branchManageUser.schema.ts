import { object, string, ref, number,array } from "yup";

export const createBranchManageSessionSchema = object({
  body: object({
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
  }),
});

export const createBranchManageSchema = object({
  body: object({
    name: string().required("Name is required"),
    lastname: string().required("Last name is required"),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be 6 chars minimum.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
    passwordConfirmation: string().required("passwordConfirmation is required").oneOf(
      [ref("password"), null],
      "Passwords must match"
    ),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),
    gsmNo: string()
  }),
});

export const crewMemberSetPermissionSchema = object({
  body: object({
    permissions: array().of(
      number().min(400).max(500)
    )
  })
});