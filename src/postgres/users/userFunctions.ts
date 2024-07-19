import { PoolClient } from "pg";
import { extractUUID } from "../../utils";
import { DBUser } from "../rowTypes";
import { createFilterQuery } from "../utils";
import { User } from "./userTypes";

type Filter =
  | {
      username?: string;
      user_sub?: string;
      email?: string;
    }
  | Record<string, string | number | boolean | Date>;

export const addUserToDatabase = async (
  dbClient: PoolClient,
  { user_sub, username, email }: Filter
) => {
  const { rows } = await dbClient.query<DBUser>(
    "INSERT INTO users(username,email,user_sub) VALUES($1,$2,$3) RETURNING *",
    [username, email, user_sub]
  );
  return rows;
};

export const readDatabaseUser = async (
  dbClient: PoolClient,
  filter: Filter = {}
): Promise<User[]> => {
  const [whereClause, values] = createFilterQuery(filter);
  const query = `SELECT id, username, bio, display_name AS "displayName", follower_count AS "followerCount", following_count as "followingCount", avatar_url AS "avatarUrl" FROM users ${whereClause}`;
  const { rows } = await dbClient.query<User>(query, values);
  return rows;
};
