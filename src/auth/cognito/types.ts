export type CognitoErrorMap<
  ErrorNamesType extends string,
  RequestBodyType
> = Partial<{
  [key in ErrorNamesType]: {
    field?: keyof RequestBodyType;
    message: string;
    code: number;
  };
}>;
