const getSpotifyTokensBodySchema = {
  type: "object",
  required: ["authCode"],
  properties: {
    authCode: { type: "string" },
  },
};

export const getSpotifyTokensOptions = {
  schema: { body: getSpotifyTokensBodySchema },
};
