"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortPost = void 0;
const createTrack_1 = require("../../tracks/createTrack");
const createShortPost = async (dbClient, shortPost) => {
    console.debug("creating short post: ", shortPost);
    const track = shortPost.track;
    const trackRows = await (0, createTrack_1.createTrack)(dbClient, track);
    if (trackRows.length === 0) {
        throw "track was not created";
    }
    const createdTrack = trackRows[0];
    console.debug("created track: ", createdTrack);
    const query = `
      WITH inserted_post AS (
        INSERT INTO short_posts (user_id, text, track_id, time_in, time_out, ext_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      )
      SELECT 
        p.id, p.name, p.artwork, p.text, p.time_in AS "timeIn", p.time_out AS "timeOut",
        p.ext_id AS "extId", p.created_at AS "createdAt", p.user_id AS "userId",
        p.spotify_id AS "spotifyId", p.save_count AS "saveCount", p.reply_count AS "replyCount",
        p.upvote_count AS "upvoteCount",
        u.username, u.avatar_url AS "avatarUrl", u.display_name AS "displayName"
      FROM inserted_post p
      JOIN users u ON p.user_id = u.id
    `;
    const values = [
        shortPost.userId,
        shortPost.text,
        createdTrack.id,
        shortPost.timeIn,
        shortPost.timeOut,
        shortPost.extId,
    ];
    const { rows } = await dbClient.query(query, values);
    return rows[0];
};
exports.createShortPost = createShortPost;
