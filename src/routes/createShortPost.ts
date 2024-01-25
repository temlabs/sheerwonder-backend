import { DBShortPost, DBTrack } from "../postgres/rowTypes";
import { CreateDBTrackParams, createTrackOptions } from "./createTrack";

const createShortPostBodySchema = {
  type: "object",
  required: ["user_id", "post_text", "track", "time_in", "time_out"],
  properties: {
    user_id: { type: "string" },
    post_text: { type: "string" },
    track: {
      type: "object",
      properties: createTrackOptions.schema.body.properties,
      required: createTrackOptions.schema.body.required,
    },
    time_in: { type: "number" },
    time_out: { type: "number" },
  },
};

export const createShortPostOptions = {
  schema: { body: createShortPostBodySchema },
};

export type CreateDBShortPostParams = Omit<
  DBShortPost,
  "reply_count" | "upvote_count" | "save_count" | "created_at" | "track_id"
> & { id: string | null; track: CreateDBTrackParams };
