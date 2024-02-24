"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDatabaseUser = exports.createDatabaseUser = void 0;
const utils_1 = require("../../utils");
const createDatabaseUser = async (dbClient, userId, username) => {
    const uuid = (0, utils_1.extractUUID)(userId);
    const { rows } = await dbClient.query("INSERT INTO users(id,username) VALUES($1,$2) RETURNING *", [uuid, username]);
    return rows;
};
exports.createDatabaseUser = createDatabaseUser;
const readDatabaseUser = async (dbClient, userId) => {
    const uuid = (0, utils_1.extractUUID)(userId);
    const { rows } = await dbClient.query("SELECT * FROM users WHERE id =($1)", [uuid]);
    return rows;
};
exports.readDatabaseUser = readDatabaseUser;
