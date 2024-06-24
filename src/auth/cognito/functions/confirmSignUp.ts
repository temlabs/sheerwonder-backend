import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { ConfirmSignUpRequestBody } from "../../authTypes";
import { calculateSecretHash } from "../utils";

export async function awsConfirmSignUp(
  client: CognitoIdentityProviderClient,
  { username, confirmationCode }: ConfirmSignUpRequestBody
) {
  const input: ConfirmSignUpCommandInput = {
    ClientId: process.env.AWS_CLIENT_ID,
    SecretHash: calculateSecretHash(
      username,
      process.env.AWS_CLIENT_ID!,
      process.env.AWS_CLIENT_SECRET!
    ),
    Username: username,

    ConfirmationCode: confirmationCode,
  };

  const command = new ConfirmSignUpCommand(input);

  const response = await client.send(command);

  return response;
}

export const cognitoConfirmSignUpErrorNames = [
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
] as const;

export type CognitoConfirmSignUpErrorNames =
  (typeof cognitoConfirmSignUpErrorNames)[number];

export const cognitoConfirmSignUpErrorMap: Partial<{
  [key in (typeof cognitoConfirmSignUpErrorNames)[number]]: {
    field?: keyof ConfirmSignUpRequestBody;
    message: string;
    code: number;
  };
}> = {
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
    message:
      "You've failed too many times. It's nothing personal but you'll have to try again later",
    code: 429,
  },
};
