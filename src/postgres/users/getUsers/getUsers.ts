import { PoolClient } from "pg";
import { User } from "../userTypes";

interface Filters {
  username?: string;
  email?: string;
  displayName?: string;
  id?: number;
}

type FilterKeys = keyof Filters;

const FILTER_COLUMNS: Record<FilterKeys, string> = {
  username: "username",
  email: "email",
  displayName: "display_name",
  id: "id",
} as const;

export async function getUsers(
  dbClient: PoolClient,
  filters?: Filters
): Promise<User[]> {
  const whereConditions: string[] = [];
  const values: any[] = [];
  let placeholderIndex = 1;

  if (filters) {
    (Object.keys(filters) as FilterKeys[]).forEach((key, index) => {
      const value = filters[key];
      const valueExists =
        typeof value === "string" ? !!value : value !== undefined;
      if (valueExists && key in FILTER_COLUMNS) {
        if (key === "id") {
          whereConditions.push(`${FILTER_COLUMNS[key]} = $${placeholderIndex}`);
          values.push(value);
        } else {
          whereConditions.push(
            `LOWER(${FILTER_COLUMNS[key]}) LIKE LOWER($${placeholderIndex})`
          );
          values.push(`%${value}%`);
        }
        placeholderIndex++;
      }
    });
  }

  const query = `
    SELECT 
      id,
      bio,
      avatar_url AS avatarUrl,
      follower_count AS followerCount,
      following_count AS followingCount,
      display_name AS displayName,
      username
    FROM users
    ${whereConditions.length ? `WHERE ${whereConditions.join(" AND ")}` : ""}
  `;
  const { rows } = await dbClient.query<User>(query, values);
  return rows;
}
