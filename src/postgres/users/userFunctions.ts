import { PoolClient } from "pg";
import { extractUUID } from "../../utils";
import { DBUser } from "../rowTypes";

interface NewUserDetails {
  username: string;
  userSub: string;
  email: string;
}

export const addUserToDatabase = async (
  dbClient: PoolClient,
  { userSub, username, email }: NewUserDetails
) => {
  const { rows } = await dbClient.query<DBUser>(
    "INSERT INTO users(username,email,user_sub) VALUES($1,$2,$3) RETURNING *",
    [username, email, userSub]
  );
  return rows;
};

export const readDatabaseUser = async (
  dbClient: PoolClient,
  filter?: { id?: number; username?: string; email?: string }
) => {
  let queryString = "SELECT * FROM users WHERE 1=1";
  const queryParams: (number | string)[] = [];
  let paramIndex = 1;

  if (filter?.id !== undefined) {
    queryString += ` AND id = $${paramIndex}`;
    queryParams.push(filter.id);
    paramIndex++;
  }

  if (filter?.username) {
    queryString += ` AND username = $${paramIndex}`;
    queryParams.push(filter.username);
    paramIndex++;
  }

  if (filter?.email) {
    queryString += ` AND email = $${paramIndex}`;
    queryParams.push(filter.email);
    paramIndex++;
  }

  const { rows } = await dbClient.query<DBUser>(queryString, queryParams);
  return rows;
};
