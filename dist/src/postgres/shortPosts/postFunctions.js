"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readShortPosts = void 0;
const filterFunctions_1 = require("../filterFunctions");
const shortPostConfig_1 = require("./shortPostConfig");
const readShortPosts = async (dbClient, filters, filterSchema, offset = "0", limit = shortPostConfig_1.SHORT_POST_READ_LIMIT.toString(), sortBy = "date") => {
    const filterKeys = Object.keys(filters);
    const whereClause = (filterKeys === null || filterKeys === void 0 ? void 0 : filterKeys.length)
        ? ` WHERE ${(0, filterFunctions_1.getWhereConditionsFromFilter)(filters, filterSchema).join(" AND ")}`
        : "";
    const orderClause = ` ORDER BY ${sortBy === "popularity"
        ? "short_posts.upvote_count DESC"
        : "short_posts.created_at DESC"}`;
    const limitOffsetClause = ` LIMIT ${limit} OFFSET ${offset !== null && offset !== void 0 ? offset : 0}`;
    const query = `SELECT short_posts.id, short_posts.user_id AS "userId", short_posts.text, short_posts.reply_count AS "replyCount", short_posts.upvote_count AS "upvoteCount", short_posts.save_count AS "saveCount", short_posts.time_in AS "timeIn", short_posts.time_out AS "timeOut", short_posts.created_at AS "createdAt", short_posts.track_id AS "trackId", short_posts.ext_id AS "extId", users.username, users.display_name AS "displayName", users.avatar_url AS "avatarUrl",tracks.artist, tracks.artwork, tracks.spotify_id AS "spotifyId", tracks.duration, tracks.name FROM short_posts JOIN users ON short_posts.user_id = users.id JOIN tracks ON short_posts.track_id = tracks.id ${whereClause} ${orderClause}${limitOffsetClause}`;
    const values = (filterKeys === null || filterKeys === void 0 ? void 0 : filterKeys.map((key) => filters[key])) || [];
    const res = await dbClient.query(query, values);
    return res.rows;
};
exports.readShortPosts = readShortPosts;
