"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCognitoUsers = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
async function listCognitoUsers(client, email) {
    const input = {
        AttributesToGet: ["email"],
        Filter: `email ^= "${email}"`,
        Limit: 10,
        UserPoolId: process.env.AWS_USER_POOL_ID,
    };
    const command = new client_cognito_identity_provider_1.ListUsersCommand(input);
    const response = await client.send(command);
    return response;
}
exports.listCognitoUsers = listCognitoUsers;
