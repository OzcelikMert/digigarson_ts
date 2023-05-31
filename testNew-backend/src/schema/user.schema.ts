import { object, string, ref, mixed, number, array } from "yup";



export const createUserSessionSchema = object({
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

export const createUserSchema = object({
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
  }),
});
export const createUserOnAdminSchema = object({
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
    branchId: string(),
    role: mixed().oneOf(['regionalmanager', 'branchmanager', 'superbranchmanager', "branchaccounting"]).required("Please provide a role."),
    email: string()
      .email("Must be a valid email")
      .required("Email is required"),

  }),
});


export const createCrewSessionSchema = object({
  body: object({
    password: number()
      .required("'password' is required"),
    branch_custom_id: number().required("'branch_custom_id' is required")
  }),
});

export const createCrewSchema = object({
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
    permissions: array(),
    branchId: string(),
    role: mixed().oneOf(['pos', 'waiter', 'accounting', 'kitchen', 'delivery']).required("Please provide a role."),

  }),
});

export const updateCrewSchema = object({
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
    permissions: array(),
    branchId: string(),
    role: mixed().oneOf(['pos', 'waiter', 'accounting', 'kitchen', 'delivery']).required("Please provide a role."),

  }),
  params: object({
    crewMemberUserId: string().required("crewMemberUserId is required"),
  }),
});

export const deleteCrewSchema = object({
  params: object({
    crewMemberUserId: string().required("crewMemberUserId is required"),
  }),
});



export const updateUserSchema = object({
  body: object({
    name: string().required("Name is required"),
    lastname: string().required("Last name is required"),
    email: string().required("Email is required.")
  })
});


export const updateUserPasswordSchema = object({
  body: object({
    oldPassword: string().required("Old password is required."),
    newPassword: string().required("New password is required"),
    confirmNewPassword: string().required("Again new password is required")
  })
});

