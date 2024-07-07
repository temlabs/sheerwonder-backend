"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const FILTER_COLUMNS = {
    username: "username",
    email: "email",
    displayName: "display_name",
    id: "id",
};
async function getUsers(dbClient, filters) {
    const whereConditions = [];
    const values = [];
    let placeholderIndex = 1;
    if (filters) {
        Object.keys(filters).forEach((key, index) => {
            const value = filters[key];
            const valueExists = typeof value === "string" ? !!value : value !== undefined;
            if (valueExists && key in FILTER_COLUMNS) {
                if (key === "id") {
                    whereConditions.push(`${FILTER_COLUMNS[key]} = $${placeholderIndex}`);
                    values.push(value);
                }
                else {
                    whereConditions.push(`LOWER(${FILTER_COLUMNS[key]}) LIKE LOWER($${placeholderIndex})`);
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
    const { rows } = await dbClient.query(query, values);
    return rows;
}
exports.getUsers = getUsers;
