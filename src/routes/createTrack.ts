import { DBTrack } from "../postgres/rowTypes";

const createTrackBodySchema = {
  type: "object",
  required: ["artist", "spotify_id", "duration", "name"],
  properties: {
    artist: { type: "string" },
    artwork: { type: "string" },
    name: { type: "string" },
    spotify_id: {
      type: "string",
    },
  },
};

export const createTrackOptions = {
  schema: { body: createTrackBodySchema },
};

export type CreateDBTrackParams = Omit<DBTrack, "id" | "created_at">;
