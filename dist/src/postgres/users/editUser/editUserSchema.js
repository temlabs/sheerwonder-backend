"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserOptions = void 0;
exports.editUserOptions = {
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
};
