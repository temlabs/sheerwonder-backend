import { MAX_SESSION_TIME } from "../authConfig";
import { createStytchClient } from "../authUtils";

export const signUp = async ({
  username,
  password,
  email,
}: SignUpBodySchema) => {
  const client = createStytchClient();

  try {
    const res = await client.passwords.create({
      email,
      password,
      name: { first_name: username },
      session_duration_minutes: MAX_SESSION_TIME,
    });
    return { sessionJwt: res.session_jwt, sessionToken: res.session_token };
  } catch (error) {
    throw error;
  }
};

const signUpBodySchema = {
  type: "object",
  required: ["password", "username", "email"],
  properties: {
    email: { type: "string" },
    username: { type: "string" },
    password: {
      type: "string",
    },
  },
};

export const signUpOptions = {
  schema: { body: signUpBodySchema },
};
export interface SignUpBodySchema {
  username: string;
  password: string;
  email: string;
}
