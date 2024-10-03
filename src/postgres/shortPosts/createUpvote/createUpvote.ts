import { PoolClient } from "pg";

export async function createUpvote(
  dbClient: PoolClient,
  postId: number,
  userId: number
) {
  const query =
    "INSERT INTO public.upvotes (user_id, short_post_id) VALUES ($1, $2) ON CONFLICT (user_id, short_post_id) DO NOTHING";
  const values = [userId, postId];
  await dbClient.query(query, values);
}
