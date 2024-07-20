import { DBTrack } from "../postgres/rowTypes";

const createTrackBodySchema = {
  type: "object",
  required: ["artist", "spotifyId", "duration", "name", "artwork"],
  properties: {
    artist: { type: "string" },
    artwork: { type: "string" },
    name: { type: "string" },
    spotifyId: {
      type: "string",
    },
  },
};

export const createTrackOptions = {
  schema: { body: createTrackBodySchema },
};

export type CreateDBTrackParams = Omit<DBTrack, "id" | "created_at">;
