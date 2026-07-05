export const registerSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        minLength: 3,
      },
      email: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        minLength: 6,
      },
    },
  },
};


export const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    additionalProperties: false,
    properties: {
      email: {
        type: "string",
        format: "email",
      },
      password: {
        type: "string",
        minLength: 6,
      },
    },
  },
};

export const refreshSchema = {
  body: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: {
        type: "string",
      },
    },
  },
};