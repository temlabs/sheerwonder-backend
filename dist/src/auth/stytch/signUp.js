"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpOptions = exports.signUp = void 0;
const authConfig_1 = require("../authConfig");
const authUtils_1 = require("../authUtils");
const signUp = async ({ username, password, email, }) => {
    const client = (0, authUtils_1.createStytchClient)();
    try {
        const res = await client.passwords.create({
            email,
            password,
            name: { first_name: username },
            session_duration_minutes: authConfig_1.MAX_SESSION_TIME,
        });
        return {
            sessionJwt: res.session_jwt,
            sessionToken: res.session_token,
            userId: res.user_id,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.signUp = signUp;
const signUpBodySchema = {
    type: "object",
    required: ["password", "username", "email"],
    properties: {
        email: { type: "string" },
        username: { type: "string" },
        password: {
            type: "string",
        },
    },
};
exports.signUpOptions = {
    schema: { body: signUpBodySchema },
};
