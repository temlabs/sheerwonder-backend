import crypto from "crypto";
import { CognitoErrorMap } from "./types";

const isCognitoError = <ErrorNameType extends string>(
  error: Error,
  errorNames: readonly ErrorNameType[]
): error is Error & { name: ErrorNameType } => {
  return errorNames.includes(error.name as ErrorNameType);
};

export const getCognitoError = <ErrorNameType extends string, RequestBodyType>(
  error: unknown,
  errorNames: readonly ErrorNameType[],
  errorMap: CognitoErrorMap<ErrorNameType, RequestBodyType>
) => {
  if (
    error instanceof Error &&
    isCognitoError<ErrorNameType>(error, errorNames)
  ) {
    const errorName = error.name as ErrorNameType;
    return (
      errorMap[errorName] ?? {
        message: "Something went wrong, please try again",
        code: 500,
      }
    );
  }
};

export function calculateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string
) {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

import { URLSearchParams } from "url";
