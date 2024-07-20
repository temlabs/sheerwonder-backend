import { PoolClient } from "pg";
import { DBTrack } from "../rowTypes";
import { CreateDBTrackParams } from "../../routes/createTrack";
import { Track } from "./trackTypes";

export const createTrack = async (dbClient: PoolClient, track: Track) => {
  console.debug("creating track: ", track);
  const { rows } = await dbClient.query<DBTrack>(
    "INSERT INTO tracks (artist, name, artwork, spotify_id, duration) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (spotify_id) DO UPDATE SET spotify_id = EXCLUDED.spotify_id RETURNING *",
    [track.artist, track.name, track.artwork, track.spotifyId, track.duration]
  );
  console.debug("track created");
  return rows;
};
