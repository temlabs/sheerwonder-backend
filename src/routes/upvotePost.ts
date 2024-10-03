import { RouteShorthandOptions } from "fastify";

const upvotePostQuerySchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "number" },
  },
};

export const upvotePostOptions: RouteShorthandOptions = {
  schema: { querystring: upvotePostQuerySchema },
};
