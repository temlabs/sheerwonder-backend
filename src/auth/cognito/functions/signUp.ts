import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  SignUpCommand,
  SignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
import crypto from "crypto";

import { ConfirmSignUpRequestBody, SignUpRequestBody } from "../../authTypes";
import { calculateSecretHash } from "../utils";

export async function awsSignUp(
  client: CognitoIdentityProviderClient,
  { username, password, email }: SignUpRequestBody
) {
  const input: SignUpCommandInput = {
    ClientId: process.env.AWS_CLIENT_ID,
    SecretHash: calculateSecretHash(
      username,
      process.env.AWS_CLIENT_ID!,
      process.env.AWS_CLIENT_SECRET!
    ),
    Username: username,
    Password: password,
    UserAttributes: [{ Name: "email", Value: email }],
  };

  const command = new SignUpCommand(input);

  const response = await client.send(command);

  return response;
}

export const cognitoSignUpErorrNames = [
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
] as const;

export type CognitoSignUpErrorNames = (typeof cognitoSignUpErorrNames)[number];

export const cognitoSignUpErrorMap: Partial<{
  [key in (typeof cognitoSignUpErorrNames)[number]]: {
    field?: keyof SignUpRequestBody;
    message: string;
    code: number;
  };
}> = {
  UsernameExistsException: {
    field: "username",
    message: "This username already exists. Time to get creative...",
    code: 400,
  },
  InvalidPasswordException: {
    field: "password",
    message: "Please provide a valid password",
    code: 400,
  },
  LimitExceededException: {
    message: "We've got a lot going on! Please try again later",
    code: 429,
  },
  TooManyRequestsException: {
    message: "We've got a lot going on! Please try again later.",
    code: 429,
  },
};
