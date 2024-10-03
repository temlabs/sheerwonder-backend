"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoSignUpErrorMap = exports.cognitoSignUpErorrNames = exports.awsSignUp = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider"); // ES Modules import
const utils_1 = require("../utils");
async function awsSignUp(client, { username, password, email }) {
    const input = {
        ClientId: process.env.AWS_CLIENT_ID,
        SecretHash: (0, utils_1.calculateSecretHash)(username, process.env.AWS_CLIENT_ID, process.env.AWS_CLIENT_SECRET),
        Username: username,
        Password: password,
        UserAttributes: [{ Name: "email", Value: email }],
    };
    const command = new client_cognito_identity_provider_1.SignUpCommand(input);
    const response = await client.send(command);
    return response;
}
exports.awsSignUp = awsSignUp;
exports.cognitoSignUpErorrNames = [
    "CodeDeliveryFailureException",
    "ForbiddenException",
    "InternalErrorException",
    "InvalidEmailRoleAccessPolicyException",
    "InvalidLambdaResponseException",
    "InvalidParameterException",
    "InvalidPasswordException",
    "InvalidSmsRoleAccessPolicyException",
    "InvalidSmsRoleTrustRelationshipException",
    "LimitExceededException",
    "NotAuthorizedException",
    "ResourceNotFoundException",
    "TooManyRequestsException",
    "UnexpectedLambdaException",
    "UserLambdaValidationException",
    "UsernameExistsException",
    "CognitoIdentityProviderServiceException",
];
exports.cognitoSignUpErrorMap = {
    UsernameExistsException: {
        field: "username",
        message: "This username already exists. Time to get creative...",
        code: 400,
        internalCode: "UsernameExists",
    },
    InvalidPasswordException: {
        field: "password",
        message: "Please provide a valid password",
        code: 400,
        internalCode: "InvalidPassword",
    },
    LimitExceededException: {
        message: "We've got a lot going on! Please try again later",
        code: 429,
        internalCode: "LimitExceeded",
    },
    TooManyRequestsException: {
        message: "We've got a lot going on! Please try again later.",
        code: 429,
        internalCode: "RequestsOverload",
    },
};
