import { CognitoIdentityProviderClientConfig } from "@aws-sdk/client-cognito-identity-provider";

export const cognitoConfig: CognitoIdentityProviderClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};
