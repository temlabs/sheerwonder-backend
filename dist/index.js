"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const postgres_1 = __importDefault(require("@fastify/postgres"));
const login_1 = require("./src/auth/stytch/login");
const stytch_1 = require("stytch");
const signUp_1 = require("./src/auth/stytch/signUp");
const userFunctions_1 = require("./src/postgres/users/userFunctions");
const createShortPost_1 = require("./src/routes/createShortPost");
const postFunctions_1 = require("./src/postgres/shortPosts/postFunctions");
const readShortPosts_1 = require("./src/routes/readShortPosts");
const getUser_1 = require("./src/routes/getUser");
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const signUp_2 = require("./src/auth/cognito/functions/signUp");
const utils_1 = require("./src/auth/cognito/utils");
const listUsers_1 = require("./src/auth/cognito/functions/listUsers");
const confirmSignUp_1 = require("./src/auth/cognito/functions/confirmSignUp");
const getUserSchema_1 = require("./src/postgres/users/getUsers/getUserSchema");
const getUsers_1 = require("./src/postgres/users/getUsers/getUsers");
const client_s3_1 = require("@aws-sdk/client-s3");
const getAvatarUploadUrl_1 = require("./src/postgres/users/getAvatarUploadUrl/getAvatarUploadUrl");
const editUserSchema_1 = require("./src/postgres/users/editUser/editUserSchema");
const editUser_1 = require("./src/postgres/users/editUser/editUser");
const cognitoAuthDecorator_1 = __importDefault(require("./src/auth/cognito/decorators/cognitoAuthDecorator"));
const createShortPost_2 = require("./src/postgres/shortPosts/createShortPost/createShortPost");
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
const cognitoClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const server = (0, fastify_1.default)(serverOptions);
const port = process.env.PORT || 3000;
server.register(postgres_1.default, {
    connectionString: process.env.DATABASE_URL,
});
server.decorate("authenticate", cognitoAuthDecorator_1.default);
server.get("/", async (request, reply) => {
    return "hello world, what's good?!\n";
});
server.post("/signUp", signUp_1.signUpOptions, async (request, reply) => {
    var _a;
    const { email, password, username } = request.body;
    let dbClient;
    try {
        const matchingUsers = await (0, listUsers_1.listCognitoUsers)(cognitoClient, email);
        if (matchingUsers.Users && ((_a = matchingUsers.Users) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            reply.status(400).send({
                message: "A user with this email already exists",
                code: 400,
                field: "email",
            });
        }
        else {
            dbClient = await server.pg.connect();
            const awsSignUpResponse = await (0, signUp_2.awsSignUp)(cognitoClient, {
                email,
                password,
                username,
            });
            const user_sub = awsSignUpResponse.UserSub;
            const userRow = await (0, userFunctions_1.addUserToDatabase)(dbClient, {
                username,
                user_sub,
                email,
            });
            const { id, avatar_url, bio, display_name, follower_count, following_count, } = userRow[0];
            const userResponse = {
                id,
                bio: bio !== null && bio !== void 0 ? bio : undefined,
                avatarUrl: avatar_url !== null && avatar_url !== void 0 ? avatar_url : undefined,
                followerCount: follower_count,
                followingCount: following_count,
                displayName: display_name !== null && display_name !== void 0 ? display_name : "",
                username,
            };
            reply.status(201).send(userResponse);
        }
    }
    catch (error) {
        const cognitoError = (0, utils_1.getCognitoError)(error, signUp_2.cognitoSignUpErorrNames, signUp_2.cognitoSignUpErrorMap);
        const errObj = error;
        if (cognitoError) {
            reply.status(cognitoError.code).send({ error: cognitoError });
        }
        else {
            console.error(error);
            reply.status(500).send({
                error: {
                    message: "We're so sorry, there seems to be an error",
                    code: 500,
                },
            });
        }
    }
    finally {
        dbClient && dbClient.release();
    }
});
server.post("/confirmSignUp", signUp_1.confirmSignUpOptions, async (request, reply) => {
    const { confirmationCode, username } = request.body;
    let dbClient;
    try {
        dbClient = await server.pg.connect();
        await (0, confirmSignUp_1.awsConfirmSignUp)(cognitoClient, {
            confirmationCode,
            username,
        });
        const userRow = await (0, userFunctions_1.readDatabaseUser)(dbClient, { username });
        if (!userRow || userRow.length === 0) {
            reply.status(404).send({
                error: {
                    code: 404,
                    message: "This user doesn't exist, please create another",
                    field: "confirmationCode",
                },
            });
        }
        else {
            const { id, avatarUrl, bio, displayName, followerCount, followingCount } = userRow[0];
            const userResponse = {
                id,
                bio: bio !== null && bio !== void 0 ? bio : undefined,
                avatarUrl: avatarUrl !== null && avatarUrl !== void 0 ? avatarUrl : undefined,
                followerCount: followerCount,
                followingCount: followingCount,
                displayName: displayName !== null && displayName !== void 0 ? displayName : "",
                username,
            };
            reply.status(201).send(userResponse);
        }
    }
    catch (error) {
        const cognitoError = (0, utils_1.getCognitoError)(error, confirmSignUp_1.cognitoConfirmSignUpErrorNames, confirmSignUp_1.cognitoConfirmSignUpErrorMap);
        const errObj = error;
        if (cognitoError) {
            reply.status(cognitoError.code).send({ error: cognitoError });
        }
        else {
            reply.status(500).send({
                error: {
                    message: "We're so sorry, there seems to be an error",
                    code: 500,
                },
            });
        }
    }
    finally {
        dbClient && dbClient.release();
    }
});
server.get("/avatarUploadUrl", { preHandler: server.authenticate() }, async (request, reply) => {
    let dbClient;
    try {
        dbClient = await server.pg.connect();
        const user = (await (0, userFunctions_1.readDatabaseUser)(dbClient, { user_sub: request.user.sub }))[0];
        const userId = user.id;
        console.debug("upload URL got user id: ", userId);
        const url = await (0, getAvatarUploadUrl_1.getAvatarUploadUrl)(s3Client, userId);
        console.debug("upload URL got upload url: ", url);
        reply.header("Content-Type", "application/json");
        reply.status(200).send({ url });
    }
    catch (error) {
        reply.status(500).send({
            error: {
                message: "We're so sorry, there seems to be an error",
                code: 500,
            },
        });
    }
    finally {
        dbClient && dbClient.release();
    }
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
server.get("/users", getUserSchema_1.getUsersOptions, async (request, reply) => {
    const dbClient = await server.pg.connect();
    try {
        const { email = "", username = "", displayName = "", id } = request.query;
        const users = await (0, getUsers_1.getUsers)(dbClient, {
            email,
            username,
            displayName,
            id,
        });
        reply.status(200).send(users);
    }
    catch (error) {
        console.error(error);
        reply.status(500).send("Error querying the database");
    }
    finally {
        dbClient.release();
    }
});
server.patch("/user", Object.assign(Object.assign({}, editUserSchema_1.editUserOptions), { preHandler: server.authenticate() }), async (request, reply) => {
    const sub = request.user.sub;
    const dbClient = await server.pg.connect();
    try {
        const body = request.body;
        const { id } = request.query;
        const updatedUser = (await (0, editUser_1.editUser)(dbClient, id, body))[0];
        reply.status(200).send(updatedUser);
    }
    catch (error) {
        console.error(error);
        reply.status(500).send("Error querying the database");
    }
    finally {
        dbClient.release();
    }
});
server.get("/user", Object.assign(Object.assign({}, getUser_1.getUserOptions), { preHandler: server.authenticate() }), async (request, reply) => {
    var _a;
    const user_sub = (_a = request.user) === null || _a === void 0 ? void 0 : _a.sub;
    const dbClient = await server.pg.connect();
    try {
        const { userId = undefined } = request.query;
        const users = await (0, userFunctions_1.readDatabaseUser)(dbClient, { id: userId, user_sub });
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
server.post("/shortPost", Object.assign(Object.assign({}, createShortPost_1.createShortPostOptions), { preHandler: server.authenticate() }), async (request, reply) => {
    const body = request.body;
    let dbClient;
    try {
        dbClient = await server.pg.connect();
        const user = (await (0, userFunctions_1.readDatabaseUser)(dbClient, { user_sub: request.user.sub }))[0];
        const userId = user.id;
        const res = await (0, createShortPost_2.createShortPost)(dbClient, Object.assign(Object.assign({}, body), { userId }));
        reply.header("Content-Type", "application/json");
        console.debug("sending res: ", Object.assign({}, res));
        reply.status(201).send(Object.assign({}, res));
    }
    catch (error) {
        console.error(error);
        reply.status(500).send("Error querying the database");
    }
    finally {
        dbClient && dbClient.release();
    }
});
// server.post("/createTrack", createTrackOptions, async (request, reply) => {
//   const body: CreateDBTrackParams = request.body as CreateDBTrackParams;
//   const dbClient = await server.pg.connect();
//   try {
//     const res = await createTrack(dbClient, body);
//     dbClient.release();
//     return { ...res[0] };
//   } catch (error) {
//     console.error(error);
//     reply.status(500).send("Error querying the database");
//   } finally {
//     dbClient.release();
//   }
// });
server.get("/shortPost", readShortPosts_1.readShortPostOptions, async (request, reply) => {
    // console.debug(readShortPostOptions);
    const filters = request.query;
    const offset = filters.offset;
    const sortBy = filters.sort_by;
    const limit = filters.limit;
    delete filters.sort_by;
    delete filters.offset;
    const dbClient = await server.pg.connect();
    try {
        const res = await (0, postFunctions_1.readShortPosts)(dbClient, filters, readShortPosts_1.readShortPostFilterSchema, offset === null || offset === void 0 ? void 0 : offset.toString(), limit === null || limit === void 0 ? void 0 : limit.toString(), sortBy);
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
