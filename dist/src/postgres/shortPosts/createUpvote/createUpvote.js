"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUpvote = void 0;
async function createUpvote(dbClient, postId, userId) {
    const query = "INSERT INTO public.upvotes (user_id, short_post_id) VALUES ($1, $2) ON CONFLICT (user_id, short_post_id) DO NOTHING";
    const values = [userId, postId];
    await dbClient.query(query, values);
}
exports.createUpvote = createUpvote;
