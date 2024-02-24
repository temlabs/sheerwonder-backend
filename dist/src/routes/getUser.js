"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOptions = void 0;
exports.getUserOptions = {
    schema: {
        querystring: {
            type: "object",
            properties: {
                userId: { type: "string" },
            },
            required: ["userId"],
        },
    },
};
