import { generateQueryStringSchema } from "../postgres/filterFunctions";
import { FILTER_OPERATION, FilterSchema } from "../postgres/filterTypes";
import { DBShortPost } from "../postgres/rowTypes";

const readShortPostFilterKeys = [
  "created_by_user_id",
  "created_at_from",
  "created_at_to",
  "upvote_count_min",
  "upvote_count_max",
  "reply_count_min",
  "reply_count_max",
  "save_count_min",
  "save_count_max",
  "track_id",
  "text",
] as const;

export type ReadShortPostFilterKey = (typeof readShortPostFilterKeys)[number];

export const readShortPostFilterSchema: FilterSchema<
  DBShortPost,
  (typeof readShortPostFilterKeys)[number]
> = {
  created_by_user_id: {
    operation: FILTER_OPERATION.EQ,
    type: "number",
    dbColumn: "user_id",
  },
  created_at_from: {
    operation: FILTER_OPERATION.MORE_THAN_EQ,
    type: "string",
    dbColumn: "created_at",
  },
  created_at_to: {
    operation: FILTER_OPERATION.LESS_THAN_EQ,
    type: "string",
    dbColumn: "created_at",
  },
  upvote_count_min: {
    operation: FILTER_OPERATION.MORE_THAN_EQ,
    type: "number",
    dbColumn: "upvote_count",
  },
  upvote_count_max: {
    operation: FILTER_OPERATION.LESS_THAN_EQ,
    type: "number",
    dbColumn: "upvote_count",
  },
  reply_count_min: {
    operation: FILTER_OPERATION.MORE_THAN_EQ,
    type: "number",
    dbColumn: "reply_count",
  },
  reply_count_max: {
    operation: FILTER_OPERATION.LESS_THAN_EQ,
    type: "number",
    dbColumn: "reply_count",
  },
  save_count_min: {
    operation: FILTER_OPERATION.MORE_THAN_EQ,
    type: "number",
    dbColumn: "save_count",
  },
  save_count_max: {
    operation: FILTER_OPERATION.LESS_THAN_EQ,
    type: "number",
    dbColumn: "save_count",
  },
  track_id: {
    operation: FILTER_OPERATION.EQ,
    type: "string",
    dbColumn: "track_id",
  },
  text: {
    operation: FILTER_OPERATION.LIKE,
    type: "string",
    dbColumn: "text",
  },
} as const;

export const readShortPostOptions = {
  schema: { querystring: generateQueryStringSchema(readShortPostFilterSchema) },
};

// export type ReadShortPostQueryStringParams = {
//   [Key in keyof typeof readShortPostFilterSchema]: (typeof readShortPostFilterSchema)[Key]["type"] extends "string"
//     ? string
//     : (typeof readShortPostFilterSchema)[Key]["type"] extends "number"
//     ? number
//     : (typeof readShortPostFilterSchema)[Key]["type"] extends "boolean"
//     ? boolean
//     : never;
// };

export type ReadShortPostQueryStringParams = {
  [key in ReadShortPostFilterKey]: string;
};
