import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

export async function listCognitoUsers(
  client: CognitoIdentityProviderClient,
  email?: string
) {
  const input: ListUsersCommandInput = {
    AttributesToGet: ["email"],
    Filter: `email ^= "${email}"`,
    Limit: 10,
    UserPoolId: process.env.AWS_USER_POOL_ID,
  };
  console.debug({ input });
  const command = new ListUsersCommand(input);
  const response = await client.send(command);
  return response;
}
