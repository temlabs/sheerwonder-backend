import { createStytchClient } from "../authUtils";
import {
  createdBeforeNowFilter,
  emailAddressAndNameFilter,
  searchUsers,
} from "./searchUsers";

const stytch = require("stytch");

export const login = async ({
  username,
  password,
  email: emailArg,
}: LoginBodySchema) => {
  const client = createStytchClient();
  if (!username && !emailArg) {
    const error = new Error("an email or username must be provided");
    throw error;
  }
  let email = emailArg ?? "";
  if (!emailArg) {
    const user = await searchUsers([
      createdBeforeNowFilter(),
      ...emailAddressAndNameFilter({ email: emailArg, username }),
    ]);
    const resultFound =
      user.results.length > 0 && user.results[0].emails.length > 0;
    email = resultFound ? user.results[0].emails[0].email : "";
  }

  try {
    const res = await client.passwords.authenticate({ email, password });
    return { sessionJwt: res.session_jwt, sessionToken: res.session_token };
  } catch (error) {
    throw error;
  }
};

const loginBodySchema = {
  type: "object",
  required: ["password"],
  properties: {
    email: { type: "string" },
    username: { type: "string" },
    password: {
      type: "string",
    },
  },
};

export const loginOptions = {
  schema: { body: loginBodySchema },
};
export interface LoginBodySchema {
  username?: string;
  password: string;
  email?: string;
}
