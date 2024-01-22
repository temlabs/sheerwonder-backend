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
    try {
        const dbClient = await server.pg.connect();
        const { rows } = await dbClient.query("SELECT * FROM test");
        dbClient.release();
        return rows;
    }
    catch (err) {
        console.error(err);
        reply.status(500).send("Error querying the database");
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
    try {
        const res = await (0, signUp_1.signUp)(body);
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
