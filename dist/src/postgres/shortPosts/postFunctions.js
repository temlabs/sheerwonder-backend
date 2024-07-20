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
    const query = `SELECT short_posts.*, users.username, users.display_name, users.avatar_url,tracks.artist, tracks.artwork, tracks.spotify_id, tracks.duration, tracks.name FROM short_posts JOIN users ON short_posts.user_id = users.id JOIN tracks ON short_posts.track_id = tracks.id ${whereClause} ${orderClause}${limitOffsetClause}`;
    const values = (filterKeys === null || filterKeys === void 0 ? void 0 : filterKeys.map((key) => filters[key])) || [];
    console.log(query);
    const res = await dbClient.query(query, values);
    return res.rows;
};
exports.readShortPosts = readShortPosts;
