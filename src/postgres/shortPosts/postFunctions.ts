import { PoolClient } from "pg";
import { DBShortPost } from "../rowTypes";
import { CreateDBShortPostParams } from "../../routes/createShortPost";
import { createTrack } from "../tracks/trackFunctions";
import { getWhereConditionsFromFilter } from "../filterFunctions";
import { SHORT_POST_READ_LIMIT } from "./shortPostConfig";
import { FilterSchema, SortBy } from "../filterTypes";
import {
  ReadShortPostFilterKey,
  ReadShortPostQueryStringParams,
} from "../../routes/readShortPosts";
import { extractUUID } from "../../utils";

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
    ? "INSERT INTO short_posts (id, user_id, text, track_id, time_in, time_out) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *"
    : "INSERT INTO short_posts (user_id, text, track_id, time_in, time_out) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const commonValues = [
    extractUUID(shortPost.user_id),
    shortPost.text,
    trackRows[0].id,
    shortPost.time_in,
    shortPost.time_out,
  ];
  const values = idProvided ? [shortPost.id, ...commonValues] : commonValues;
  const { rows } = await dbClient.query<DBShortPost>(query, values);

  return rows[0];
};

export const readShortPosts = async (
  dbClient: PoolClient,
  filters: ReadShortPostQueryStringParams,
  filterSchema: FilterSchema<DBShortPost, ReadShortPostFilterKey>,
  offset: string = "0",
  sortBy: SortBy = "date"
) => {
  const filterKeys = Object.keys(filters) as ReadShortPostFilterKey[];
  const whereClause = filterKeys?.length
    ? ` WHERE ${getWhereConditionsFromFilter<
        DBShortPost,
        ReadShortPostFilterKey
      >(filters, filterSchema).join(" AND ")}`
    : "";

  const orderClause = ` ORDER BY ${
    sortBy === "popularity"
      ? "short_posts.upvote_count DESC"
      : "short_posts.created_at DESC"
  }`;

  const limitOffsetClause = ` LIMIT ${SHORT_POST_READ_LIMIT} OFFSET ${
    offset ?? 0
  }`;

  const query = `SELECT short_posts.*, users.username, users.display_name, users.avatar_url,tracks.artist, tracks.artwork, tracks.spotify_id, tracks.duration, tracks.name FROM short_posts${whereClause} JOIN users ON short_posts.user_id = users.id JOIN tracks ON short_posts.track_id = tracks.id ${orderClause}${limitOffsetClause}`;
  const values =
    filterKeys?.map((key: ReadShortPostFilterKey) => filters[key]) || [];

  const res = await dbClient.query<DBShortPost>(query, values);

  return res.rows;
};
