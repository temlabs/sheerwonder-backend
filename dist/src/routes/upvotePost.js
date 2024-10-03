"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upvotePostOptions = void 0;
const upvotePostQuerySchema = {
    type: "object",
    required: ["id"],
    properties: {
        id: { type: "number" },
    },
};
exports.upvotePostOptions = {
    schema: { querystring: upvotePostQuerySchema },
};
