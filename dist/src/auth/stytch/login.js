"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginOptions = exports.login = void 0;
const utils_1 = require("../../utils");
const authConfig_1 = require("../authConfig");
const authUtils_1 = require("../authUtils");
const searchUsers_1 = require("./searchUsers");
const login = async ({ username, password, email: emailArg, }) => {
    const client = (0, authUtils_1.createStytchClient)();
    if (!username && !emailArg) {
        const error = new Error("an email or username must be provided");
        throw error;
    }
    let email = emailArg !== null && emailArg !== void 0 ? emailArg : "";
    if (!emailArg) {
        const user = await (0, searchUsers_1.searchUsers)([
            (0, searchUsers_1.createdBeforeNowFilter)(),
            ...(0, searchUsers_1.emailAddressAndNameFilter)({ email: emailArg, username }),
        ]);
        const resultFound = user.results.length > 0 && user.results[0].emails.length > 0;
        email = resultFound ? user.results[0].emails[0].email : "";
    }
    try {
        const res = await client.passwords.authenticate({
            email,
            password,
            session_duration_minutes: authConfig_1.MAX_SESSION_TIME,
        });
        return {
            sessionJwt: res.session_jwt,
            sessionToken: res.session_token,
            user_id: (0, utils_1.extractUUID)(res.user_id),
        };
    }
    catch (error) {
        throw error;
    }
};
exports.login = login;
const loginBodySchema = {
    type: "object",
    required: ["password"],
    properties: {
        email: { type: "string" },
        username: { type: "string" },
        password: {
            type: "string",
        },
    },
};
exports.loginOptions = {
    schema: { body: loginBodySchema },
};
