import { PoolClient } from "pg";
import { DBShortPost } from "../rowTypes";
import { getWhereConditionsFromFilter } from "../filterFunctions";
import { SHORT_POST_READ_LIMIT } from "./shortPostConfig";
import { FilterSchema, SortBy } from "../filterTypes";
import {
  ReadShortPostFilterKey,
  ReadShortPostQueryStringParams,
} from "../../routes/readShortPosts";
import { extractUUID } from "../../utils";

export const readShortPosts = async (
  dbClient: PoolClient,
  filters: ReadShortPostQueryStringParams,
  filterSchema: FilterSchema<DBShortPost, ReadShortPostFilterKey>,
  offset: string = "0",
  limit: string = SHORT_POST_READ_LIMIT.toString(),
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

  const limitOffsetClause = ` LIMIT ${limit} OFFSET ${offset ?? 0}`;

  const query = `SELECT short_posts.*, users.username, users.display_name, users.avatar_url,tracks.artist, tracks.artwork, tracks.spotify_id, tracks.duration, tracks.name FROM short_posts JOIN users ON short_posts.user_id = users.id JOIN tracks ON short_posts.track_id = tracks.id ${whereClause} ${orderClause}${limitOffsetClause}`;
  const values =
    filterKeys?.map((key: ReadShortPostFilterKey) => filters[key]) || [];
  console.log(query);
  const res = await dbClient.query<DBShortPost>(query, values);

  return res.rows;
};
