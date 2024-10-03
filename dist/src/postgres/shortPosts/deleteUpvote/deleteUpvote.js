"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUpvote = void 0;
async function deleteUpvote(dbClient, postId, userId) {
    const query = "DELETE FROM public.upvotes WHERE user_id = $1 AND short_post_id = $2";
    const values = [userId, postId];
    await dbClient.query(query, values);
}
exports.deleteUpvote = deleteUpvote;
