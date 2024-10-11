"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessTokenOptions = void 0;
const refreshAccessTokensBodySchema = {
    type: "object",
    required: ["refreshToken"],
    properties: {
        authCode: { type: "string" },
    },
};
exports.refreshAccessTokenOptions = {
    schema: { body: refreshAccessTokensBodySchema },
};
