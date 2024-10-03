import { ErrorResponse } from "../../error/types";

export type CognitoErrorMap<
  ErrorNamesType extends string,
  RequestBodyType
> = Partial<{
  [key in ErrorNamesType]: ErrorResponse & {
    field?: keyof RequestBodyType;
  };
}>;
