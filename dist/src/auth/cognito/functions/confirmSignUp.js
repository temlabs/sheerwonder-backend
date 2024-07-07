"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoConfirmSignUpErrorMap = exports.cognitoConfirmSignUpErrorNames = exports.awsConfirmSignUp = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const utils_1 = require("../utils");
async function awsConfirmSignUp(client, { username, confirmationCode }) {
    const input = {
        ClientId: process.env.AWS_CLIENT_ID,
        SecretHash: (0, utils_1.calculateSecretHash)(username, process.env.AWS_CLIENT_ID, process.env.AWS_CLIENT_SECRET),
        Username: username,
        ConfirmationCode: confirmationCode,
    };
    const command = new client_cognito_identity_provider_1.ConfirmSignUpCommand(input);
    const response = await client.send(command);
    return response;
}
exports.awsConfirmSignUp = awsConfirmSignUp;
exports.cognitoConfirmSignUpErrorNames = [
    "AliasExistsException",
    "CodeMismatchException",
    "ExpiredCodeException",
    "ForbiddenException",
    "InternalErrorException",
    "InvalidLambdaResponseException",
    "InvalidParameterException",
    "LimitExceededException",
    "NotAuthorizedException",
    "ResourceNotFoundException",
    "TooManyFailedAttemptsException",
    "TooManyRequestsException",
    "UnexpectedLambdaException",
    "UserLambdaValidationException",
    "UserNotFoundException",
    "CognitoIdentityProviderServiceException",
];
exports.cognitoConfirmSignUpErrorMap = {
    CodeMismatchException: {
        field: "confirmationCode",
        message: "Oops- wrong code. Try again?",
        code: 400,
    },
    ExpiredCodeException: {
        field: "confirmationCode",
        message: "This code has expired. Please request a new one",
        code: 400,
    },
    LimitExceededException: {
        field: "confirmationCode",
        message: "We've got a lot going on! Please try again later",
        code: 429,
    },
    TooManyRequestsException: {
        field: "confirmationCode",
        message: "We've got a lot going on! Please try again later.",
        code: 429,
    },
    TooManyFailedAttemptsException: {
        field: "confirmationCode",
        message: "You've failed too many times. It's nothing personal but you'll have to try again later",
        code: 429,
    },
};
