import * as stytch from "stytch";

export const createStytchClient = () => {
  const client = new stytch.Client({
    project_id: process.env.STYTCH_PROJECT_ID!,
    secret: process.env.STYTCH_SECRET!,
    env: stytch.envs.test,
  });
  return client;
};
