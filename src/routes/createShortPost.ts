import { DBShortPost, DBTrack } from "../postgres/rowTypes";
import { CreateDBTrackParams, createTrackOptions } from "./createTrack";

const createShortPostBodySchema = {
  type: "object",
  required: ["text", "track", "timeIn", "timeOut", "extId"],
  properties: {
    text: { type: "string" },
    track: {
      type: "object",
      properties: createTrackOptions.schema.body.properties,
      required: createTrackOptions.schema.body.required,
    },
    timeIn: { type: "number" },
    timeOut: { type: "number" },
    extId: { type: "string" },
  },
};

export const createShortPostOptions = {
  schema: { body: createShortPostBodySchema },
};

export type CreateDBShortPostParams = Omit<
  DBShortPost,
  "reply_count" | "upvote_count" | "save_count" | "created_at" | "track_id"
> & { id: string | null; track: CreateDBTrackParams };
