import { PoolClient } from "pg";
import { DBShortPost } from "../rowTypes";
import { getWhereConditionsFromFilter } from "../filterFunctions";
import { SHORT_POST_READ_LIMIT } from "./shortPostConfig";
import { FilterSchema, SortBy } from "../filterTypes";
import {
  ReadShortPostFilterKey,
  ReadShortPostQueryStringParams,
} from "../../routes/readShortPosts";

export const readShortPosts = async (
  dbClient: PoolClient,
  filters: ReadShortPostQueryStringParams,
  filterSchema: FilterSchema<DBShortPost, ReadShortPostFilterKey>,
  offset: string = "0",
  limit: string = SHORT_POST_READ_LIMIT.toString(),
  sortBy: SortBy = "date",
  userId: number
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

  const query = `
    SELECT 
      short_posts.id, 
      short_posts.user_id AS "userId", 
      short_posts.text, 
      short_posts.reply_count AS "replyCount", 
      short_posts.upvote_count AS "upvoteCount", 
      short_posts.save_count AS "saveCount", 
      short_posts.time_in AS "timeIn", 
      short_posts.time_out AS "timeOut", 
      short_posts.created_at AS "createdAt", 
      short_posts.track_id AS "trackId", 
      short_posts.ext_id AS "extId", 
      users.username, 
      users.display_name AS "displayName", 
      users.avatar_url AS "avatarUrl",
      tracks.artist, 
      tracks.artwork, 
      tracks.spotify_id AS "spotifyId", 
      tracks.duration, 
      tracks.name,
      CASE 
        WHEN upvotes.id IS NOT NULL THEN TRUE 
        ELSE FALSE 
      END AS "isUpvoted"
    FROM short_posts 
    JOIN users ON short_posts.user_id = users.id 
    JOIN tracks ON short_posts.track_id = tracks.id 
    LEFT JOIN upvotes ON short_posts.id = upvotes.short_post_id AND upvotes.user_id = $1
    ${whereClause} 
    ${orderClause}
    ${limitOffsetClause}
  `;

  const values = [
    userId,
    ...(filterKeys?.map((key: ReadShortPostFilterKey) => filters[key]) || []),
  ];
  const res = await dbClient.query<DBShortPost & { isUpvoted: boolean }>(
    query,
    values
  );
  return res.rows;
};
