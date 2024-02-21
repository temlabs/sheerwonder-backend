"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readShortPostOptions = exports.readShortPostFilterSchema = void 0;
const filterFunctions_1 = require("../postgres/filterFunctions");
const filterTypes_1 = require("../postgres/filterTypes");
const readShortPostFilterKeys = [
    "user_id",
    "created_at_from",
    "created_at_to",
    "upvote_count_min",
    "upvote_count_max",
    "reply_count_min",
    "reply_count_max",
    "save_count_min",
    "save_count_max",
    "track_id",
    "post_text",
];
exports.readShortPostFilterSchema = {
    user_id: {
        operation: filterTypes_1.FILTER_OPERATION.EQ,
        type: "string",
        dbColumn: "user_id",
    },
    created_at_from: {
        operation: filterTypes_1.FILTER_OPERATION.MORE_THAN_EQ,
        type: "string",
        dbColumn: "created_at",
    },
    created_at_to: {
        operation: filterTypes_1.FILTER_OPERATION.LESS_THAN_EQ,
        type: "string",
        dbColumn: "created_at",
    },
    upvote_count_min: {
        operation: filterTypes_1.FILTER_OPERATION.MORE_THAN_EQ,
        type: "number",
        dbColumn: "upvote_count",
    },
    upvote_count_max: {
        operation: filterTypes_1.FILTER_OPERATION.LESS_THAN_EQ,
        type: "number",
        dbColumn: "upvote_count",
    },
    reply_count_min: {
        operation: filterTypes_1.FILTER_OPERATION.MORE_THAN_EQ,
        type: "number",
        dbColumn: "reply_count",
    },
    reply_count_max: {
        operation: filterTypes_1.FILTER_OPERATION.LESS_THAN_EQ,
        type: "number",
        dbColumn: "reply_count",
    },
    save_count_min: {
        operation: filterTypes_1.FILTER_OPERATION.MORE_THAN_EQ,
        type: "number",
        dbColumn: "save_count",
    },
    save_count_max: {
        operation: filterTypes_1.FILTER_OPERATION.LESS_THAN_EQ,
        type: "number",
        dbColumn: "save_count",
    },
    track_id: {
        operation: filterTypes_1.FILTER_OPERATION.EQ,
        type: "string",
        dbColumn: "track_id",
    },
    post_text: {
        operation: filterTypes_1.FILTER_OPERATION.LIKE,
        type: "string",
        dbColumn: "post_text",
    },
};
exports.readShortPostOptions = {
    schema: { querystring: (0, filterFunctions_1.generateQueryStringSchema)(exports.readShortPostFilterSchema) },
};
