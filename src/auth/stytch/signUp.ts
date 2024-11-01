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

    return {
      sessionJwt: res.session_jwt,
      sessionToken: res.session_token,
      userId: res.user_id,
    };
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

const confirmSignUpBodySchema = {
  type: "object",
  required: ["username", "confirmationCode"],
  properties: {
    confirmationCode: { type: "string" },
    username: { type: "string" },
  },
};

export const confirmSignUpOptions = {
  schema: { body: confirmSignUpBodySchema },
};

export interface SignUpBodySchema {
  username: string;
  password: string;
  email: string;
}
