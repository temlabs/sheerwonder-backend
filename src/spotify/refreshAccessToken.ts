const refreshAccessTokensBodySchema = {
  type: "object",
  required: ["refreshToken"],
  properties: {
    authCode: { type: "string" },
  },
};

export const refreshAccessTokenOptions = {
  schema: { body: refreshAccessTokensBodySchema },
};
