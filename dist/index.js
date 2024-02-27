"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const postgres_1 = __importDefault(require("@fastify/postgres"));
const searchUsers_1 = require("./src/auth/stytch/searchUsers");
const login_1 = require("./src/auth/stytch/login");
const stytch_1 = require("stytch");
const signUp_1 = require("./src/auth/stytch/signUp");
const userFunctions_1 = require("./src/postgres/users/userFunctions");
const createShortPost_1 = require("./src/routes/createShortPost");
const postFunctions_1 = require("./src/postgres/shortPosts/postFunctions");
const createTrack_1 = require("./src/routes/createTrack");
const trackFunctions_1 = require("./src/postgres/tracks/trackFunctions");
const readShortPosts_1 = require("./src/routes/readShortPosts");
const getUser_1 = require("./src/routes/getUser");
require("dotenv").config();
const fs = require("fs");
let serverOptions = {};
if (process.env.NODE_ENV === "dev") {
    const privateKeyPath = "C:\\localhost.key";
    const certificatePath = "C:\\localhost.crt";
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const certificate = fs.readFileSync(certificatePath, "utf8");
    //pls deploy
    const credentials = { key: privateKey, cert: certificate };
    serverOptions = { https: credentials };
}
const server = (0, fastify_1.default)(serverOptions);
const ser = (0, fastify_1.default)();
const port = process.env.PORT || 3000;
server.register(postgres_1.default, {
    connectionString: process.env.DATABASE_URL,
});
server.get("/", async (request, reply) => {
    return "hello world, what's good?!\n";
});
server.get("/ping", async (request, reply) => {
    return "pong\n";
});
server.get("/names", async (request, reply) => {
    const dbClient = await server.pg.connect();
    try {
        const { rows } = await dbClient.query("SELECT * FROM test");
        return rows;
    }
    catch (err) {
        console.error(err);
        reply.status(500).send("Error querying the database");
    }
    finally {
        dbClient.release();
    }
});
server.get("/userExists", searchUsers_1.getUsersOptions, async (request, reply) => {
    var _a;
    try {
        const { email = "", username = "" } = request.query;
        const { results: users } = await (0, searchUsers_1.searchUsers)([
            (0, searchUsers_1.createdBeforeNowFilter)(),
            ...(0, searchUsers_1.emailAddressAndNameFilter)({ email, username }),
        ]);
        if (users.length === 0) {
            return false;
        }
        const user = users[0];
        if (username) {
            return ((_a = user.name) === null || _a === void 0 ? void 0 : _a.first_name) === username.replaceAll("@", "");
        }
        return !!user;
    }
    catch (error) {
        console.error(error);
        reply.status(500).send("Error querying the database");
    }
});
server.get("/user", getUser_1.getUserOptions, async (request, reply) => {
    const dbClient = await server.pg.connect();
    try {
        const { userId = "" } = request.query;
        const users = await (0, userFunctions_1.readDatabaseUser)(dbClient, userId);
        if (users.length === 0) {
            reply.status(404).send("User not found");
            return;
        }
        return users[0];
    }
    catch (error) {
        console.error(error);
        reply.status(500).send("Error querying the database");
    }
    finally {
        dbClient.release();
    }
});
server.post("/login", login_1.loginOptions, async (request, reply) => {
    const body = request.body;
    try {
        const res = await (0, login_1.login)(body);
        return res;
    }
    catch (error) {
        console.error(error);
        if (error instanceof stytch_1.StytchError) {
            reply.status(error.status_code).send({
                message: error.error_message,
                name: error.name,
                type: error.error_type,
            });
            return;
        }
        reply.status(500).send("Error querying the database");
    }
});
server.post("/signUp", signUp_1.signUpOptions, async (request, reply) => {
    const body = request.body;
    const dbClient = await server.pg.connect();
    try {
        const res = await (0, signUp_1.signUp)(body);
        const dbUser = await (0, userFunctions_1.createDatabaseUser)(dbClient, res.userId, body.username);
        dbClient.release();
        return Object.assign(Object.assign({}, res), { user: dbUser[0] });
    }
    catch (error) {
        console.error(error);
        if (error instanceof stytch_1.StytchError) {
            reply.status(error.status_code).send({
                message: error.error_message,
                name: error.name,
                type: error.error_type,
            });
            return;
        }
        reply.status(500).send("Error querying the database");
    }
    finally {
        dbClient.release();
    }
});
server.post("/createShortPost", createShortPost_1.createShortPostOptions, async (request, reply) => {
    const body = request.body;
    const dbClient = await server.pg.connect();
    try {
        const res = await (0, postFunctions_1.createShortPost)(dbClient, body);
        dbClient.release();
        return Object.assign({}, res);
    }
    catch (error) {
        console.error(error);
        reply.status(500).send("Error querying the database");
    }
    finally {
        dbClient.release();
    }
});
server.post("/createTrack", createTrack_1.createTrackOptions, async (request, reply) => {
    const body = request.body;
    const dbClient = await server.pg.connect();
    try {
        const res = await (0, trackFunctions_1.createTrack)(dbClient, body);
        dbClient.release();
        return Object.assign({}, res[0]);
    }
    catch (error) {
        console.error(error);
        reply.status(500).send("Error querying the database");
    }
    finally {
        dbClient.release();
    }
});
server.get("/shortPosts", readShortPosts_1.readShortPostOptions, async (request, reply) => {
    // console.debug(readShortPostOptions);
    const filters = request.query;
    const offset = filters.offset;
    const sortBy = filters.sort_by;
    delete filters.sort_by;
    delete filters.offset;
    const dbClient = await server.pg.connect();
    try {
        const res = await (0, postFunctions_1.readShortPosts)(dbClient, filters, readShortPosts_1.readShortPostFilterSchema, offset, sortBy);
        return res;
    }
    catch (error) {
        console.error(error);
        reply.status(500).send("Error querying the database");
    }
    finally {
        dbClient.release();
    }
});
server.listen({
    port: port,
    host: process.env.NODE_ENV === "dev" ? "127.0.0.1" : "0.0.0.0",
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
