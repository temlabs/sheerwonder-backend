export const editUserOptions = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
      required: [],
    },
    body: {
      type: "object",
      properties: {
        bio: { type: "string" },
        displayName: { type: "string" },
        hasAvatar: { type: "boolean" },
      },
    },
  },
} as const;

export interface EditUserBodySchema {
  bio: string;
  displayName: string;
  hasAvatar: boolean;
}

export interface EditUserQueryStringSchema {
  id: number;
}
