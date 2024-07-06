import { PoolClient } from "pg";
import { EditUserBodySchema } from "./editUserSchema";

export async function editUser(
  dbClient: PoolClient,
  id: number,
  details: EditUserBodySchema
) {
  const { bio, displayName, hasAvatar } = details;
  const avatarUrl = hasAvatar
    ? `https://${process.env.AWS_AVATAR_BUCKET_NAME}.s3.${
        process.env.AWS_REGION
      }.amazonaws.com/user-${id.toString()}`
    : null;

  const query = `UPDATE users SET bio = COALESCE($1, bio), display_name = COALESCE($2, display_name), avatar_url = $3 WHERE id = $4 RETURNING id, display_name AS displayName, bio, username, follower_count AS followerCount, following_count AS followingCount, avatar_url AS avatarUrl`;
  const values = [bio, displayName, avatarUrl, id];
  const result = await dbClient.query(query, values);
  return result.rows;
}
