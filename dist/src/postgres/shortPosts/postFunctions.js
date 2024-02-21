"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readShortPosts = exports.createShortPost = void 0;
const trackFunctions_1 = require("../tracks/trackFunctions");
const filterFunctions_1 = require("../filterFunctions");
const shortPostConfig_1 = require("./shortPostConfig");
const createShortPost = async (dbClient, shortPost) => {
    const track = shortPost.track;
    const trackRows = await (0, trackFunctions_1.createTrack)(dbClient, track);
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
    const { rows } = await dbClient.query(query, values);
    return rows[0];
};
exports.createShortPost = createShortPost;
const readShortPosts = async (dbClient, filters, filterSchema, offset = "0", sortBy = "date") => {
    const filterKeys = Object.keys(filters);
    const whereClause = (filterKeys === null || filterKeys === void 0 ? void 0 : filterKeys.length)
        ? ` WHERE ${(0, filterFunctions_1.getWhereConditionsFromFilter)(filters, filterSchema).join(" AND ")}`
        : "";
    console.debug(whereClause);
    const orderClause = ` ORDER BY ${sortBy === "popularity" ? "upvote_count DESC" : "created_at DESC"}`;
    console.debug(orderClause);
    const limitOffsetClause = ` LIMIT ${shortPostConfig_1.SHORT_POST_READ_LIMIT} OFFSET ${offset !== null && offset !== void 0 ? offset : 0}`;
    const query = `SELECT * FROM short_posts${whereClause}${orderClause}${limitOffsetClause}`;
    const values = (filterKeys === null || filterKeys === void 0 ? void 0 : filterKeys.map((key) => filters[key])) || [];
    const res = await dbClient.query(query, values);
    return res.rows;
};
exports.readShortPosts = readShortPosts;
