import { PoolClient } from "pg";
import { extractUUID } from "../../utils";
import { DBUser } from "../rowTypes";

export const createDatabaseUser = async (
  dbClient: PoolClient,
  userId: string,
  username: string
) => {
  const uuid = extractUUID(userId);
  const { rows } = await dbClient.query<DBUser>(
    "INSERT INTO users(id,username) VALUES($1,$2) RETURNING *",
    [uuid, username]
  );

  return rows;
};

export const readDatabaseUser = async (
  dbClient: PoolClient,
  userId: string
) => {
  const uuid = extractUUID(userId);
  const { rows } = await dbClient.query<DBUser>(
    "SELECT * FROM users WHERE id =($1)",
    [uuid]
  );
  return rows;
};
