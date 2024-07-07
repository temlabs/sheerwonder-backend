"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersOptions = void 0;
exports.getUsersOptions = {
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
};
