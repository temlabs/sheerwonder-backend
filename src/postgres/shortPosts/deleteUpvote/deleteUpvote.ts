import { PoolClient } from "pg";

export async function deleteUpvote(
  dbClient: PoolClient,
  postId: number,
  userId: number
) {
  const query =
    "DELETE FROM public.upvotes WHERE user_id = $1 AND short_post_id = $2";
  const values = [userId, postId];
  await dbClient.query(query, values);
}
