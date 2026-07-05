export const createTaskSchema = {
  body: {
    type: "object",
    required: ["title"],
    additionalProperties: false,
    properties: {
      title: {
        type: "string",
        minLength: 3,
      },
      description: {
        type: "string",
      },
    },
  },
};

export const updateTaskSchema = {
  body: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: {
        type: "string",
        minLength: 3,
      },
      description: {
        type: "string",
      },
      completed: {
        type: "boolean",
      },
    },
  },
};

export const paginationSchema = {
  querystring: {
    type: "object",
    properties: {
      page: {
        type: "integer",
        minimum: 1,
      },
      limit: {
        type: "integer",
        minimum: 1,
      },
    },
  },
};

export const searchSchema = {
  querystring: {
    type: "object",
    required: ["keyword"],
    properties: {
      keyword: {
        type: "string",
        minLength: 1,
      },
    },
  },
};