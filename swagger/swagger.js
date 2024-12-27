module.exports = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation for the Express app",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],

  paths: {
    "/userinfo": {
      get: {
        summary: "Get all user information",
        description: "Fetch a list of all users from the database.",
        responses: {
          200: {
            description: "Successful response with user data",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      user_name: { type: "string" },
                      user_email: { type: "string" },
                      user_id: { type: "string" },
                      user_age: { type: "integer" }, // Changed to 'integer'
                      user_gender: { type: "boolean" }, // Changed to 'boolean'
                      user_pw: { type: "varchar" },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Server error" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Add new user information",
        description: "Insert a new user record into the database.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user_name: { type: "string" },
                  user_email: { type: "string" },
                  user_id: { type: "string" },
                  user_age: { type: "integer" }, // Changed to 'integer'
                  user_gender: { type: "boolean" },
                  user_pw: { type: "varchar" }, // Changed to 'boolean'
                },
                required: [
                  "user_name",
                  "user_email",
                  "user_id",
                  "user_age",
                  "user_gender",
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "User added successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User added successfully",
                    },
                    user: {
                      type: "object",
                      properties: {
                        user_name: { type: "string" },
                        user_email: { type: "string" },
                        user_id: { type: "string" },
                        user_age: { type: "integer" }, // Changed to 'integer'
                        user_gender: { type: "boolean" },
                        user_pw: { type: "varchar" }, // Changed to 'boolean'
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request. Missing required fields.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Bad Request" },
                  },
                },
              },
            },

            put: { summary: "Update user information" },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Server error" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/userinfo/{user_pw}": {
      put: {
        summary: "Update user by user_pw",
        description: "Update a user's information by their password (user_pw).",
        parameters: [
          {
            name: "user_pw",
            in: "path",
            required: true,
            description: "Password of the user to update",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user_name: { type: "string" },
                  user_email: { type: "string" },
                  gender: { type: "string" },
                  age: { type: "integer" },
                  fb_uid: { type: "string" },
                },
                required: [
                  "user_name",
                  "user_email",
                  "gender",
                  "age",
                  "fb_uid",
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: "User updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User updated successfully",
                    },
                    user: {
                      type: "object",
                      properties: {
                        user_pw: { type: "string" },
                        user_name: { type: "string" },
                        user_email: { type: "string" },
                        gender: { type: "string" },
                        age: { type: "integer" },
                        fb_uid: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
            "/userinfo/{user_pw}": {
              delete: {
                summary: "Delete user by user_pw",
                description: "Delete a user by their password (user_pw).",
                parameters: [
                  {
                    name: "user_pw",
                    in: "path",
                    required: true,
                    description: "Password of the user to delete",
                    schema: {
                      type: "string",
                    },
                  },
                ],
                responses: {
                  200: {
                    description: "User deleted successfully",
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          properties: {
                            message: {
                              type: "string",
                              example: "User deleted successfully",
                            },
                          },
                        },
                      },
                    },
                  },
                  404: {
                    description: "User not found",
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          properties: {
                            message: {
                              type: "string",
                              example: "User not found",
                            },
                          },
                        },
                      },
                    },
                  },
                  500: {
                    description: "Server error",
                    content: {
                      "application/json": {
                        schema: {
                          type: "object",
                          properties: {
                            message: {
                              type: "string",
                              example: "Server error",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad Request. Missing required fields.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Bad Request. Missing fields.",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "User not found" },
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Server error" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/diary": {
      get: {
        summary: "Get all diary entries",
        description: "Fetch a list of all diary entries from the database.",
        responses: {
          200: {
            description: "Successful response with diary data",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      diary_pk: { type: "string" },
                      user_id: { type: "string" },
                      title: { type: "string" },
                      content: { type: "string", nullable: true },
                      created_at: {
                        type: "string",
                        format: "date",
                        nullable: true,
                      },
                      updated_at: {
                        type: "string",
                        format: "date",
                        nullable: true,
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
