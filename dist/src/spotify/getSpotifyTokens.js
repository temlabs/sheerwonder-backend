"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpotifyTokensOptions = void 0;
const getSpotifyTokensBodySchema = {
    type: "object",
    required: ["authCode"],
    properties: {
        authCode: { type: "string" },
    },
};
exports.getSpotifyTokensOptions = {
    schema: { body: getSpotifyTokensBodySchema },
};
