export const getUsersOptions = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        email: { type: "string" },
        username: { type: "string" },
        displayName: { type: "string" },
        id: { type: "number" },
      },
      required: [],
    },
  },
} as const;

export interface GetUsersSchema {
  username?: string;
  email?: string;
  displayName?: string;
  id?: number;
}
