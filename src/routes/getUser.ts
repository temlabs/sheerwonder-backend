export const getUserOptions = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        userId: { type: "string" },
      },
      // required: ["userId"],
    },
  },
} as const;

export interface GetUserSchema {
  userId: number;
}
