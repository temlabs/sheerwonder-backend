"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDatabaseUser = exports.addUserToDatabase = void 0;
const addUserToDatabase = async (dbClient, { userSub, username, email }) => {
    const { rows } = await dbClient.query("INSERT INTO users(username,email,user_sub) VALUES($1,$2,$3) RETURNING *", [username, email, userSub]);
    return rows;
};
exports.addUserToDatabase = addUserToDatabase;
const readDatabaseUser = async (dbClient, filter) => {
    let queryString = "SELECT * FROM users WHERE 1=1";
    const queryParams = [];
    let paramIndex = 1;
    if ((filter === null || filter === void 0 ? void 0 : filter.id) !== undefined) {
        queryString += ` AND id = $${paramIndex}`;
        queryParams.push(filter.id);
        paramIndex++;
    }
    if (filter === null || filter === void 0 ? void 0 : filter.username) {
        queryString += ` AND username = $${paramIndex}`;
        queryParams.push(filter.username);
        paramIndex++;
    }
    if (filter === null || filter === void 0 ? void 0 : filter.email) {
        queryString += ` AND email = $${paramIndex}`;
        queryParams.push(filter.email);
        paramIndex++;
    }
    const { rows } = await dbClient.query(queryString, queryParams);
    return rows;
};
exports.readDatabaseUser = readDatabaseUser;
