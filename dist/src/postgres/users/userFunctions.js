"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDatabaseUser = exports.addUserToDatabase = void 0;
const utils_1 = require("../utils");
const addUserToDatabase = async (dbClient, { user_sub, username, email }) => {
    const { rows } = await dbClient.query("INSERT INTO users(username,email,user_sub) VALUES($1,$2,$3) RETURNING *", [username, email, user_sub]);
    return rows;
};
exports.addUserToDatabase = addUserToDatabase;
const readDatabaseUser = async (dbClient, filter = {}) => {
    const [whereClause, values] = (0, utils_1.createFilterQuery)(filter);
    const query = `SELECT id, username, bio, display_name AS "displayName", follower_count AS "followerCount", following_count as "followingCount", avatar_url AS "avatarUrl" FROM users ${whereClause}`;
    const { rows } = await dbClient.query(query, values);
    return rows;
};
exports.readDatabaseUser = readDatabaseUser;
