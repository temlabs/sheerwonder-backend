import { PoolClient } from "pg";
import { DBShortPost, DBTrack } from "../rowTypes";
import { CreateDBShortPostParams } from "../../routes/createShortPost";
import { createTrack } from "../tracks/trackFunctions";

export const createShortPost = async (
  dbClient: PoolClient,
  shortPost: CreateDBShortPostParams
) => {
  const track = shortPost.track;

  const trackRows = await createTrack(dbClient, track);

  if (trackRows.length === 0) {
    throw "track was not created";
  }
  const idProvided = !!shortPost.id;
  const query = idProvided
    ? "INSERT INTO short_posts (id, user_id, post_text, track_id, time_in, time_out) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
    : "INSERT INTO short_posts (user_id, post_text, track_id, time_in, time_out) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const commonValues = [
    shortPost.user_id,
    shortPost.post_text,
    trackRows[0].id,
    shortPost.time_in,
    shortPost.time_out,
  ];
  const values = idProvided ? [shortPost.id, ...commonValues] : commonValues;
  const { rows } = await dbClient.query<DBShortPost>(query, values);

  return rows[0];
};
