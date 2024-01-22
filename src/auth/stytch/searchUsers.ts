process.env.PORT;

import * as stytch from "stytch";
import { BEGINNING_OF_TIME } from "../../config";

const client = new stytch.Client({
  project_id: "project-test-2de4cd04-a5ef-4c66-83bd-963ed4e3cc2b",
  secret: "secret-test-8nOgZT_UT8yhs6ALNqmL1jwAS4q8RTqix0I=",
  env: stytch.envs.test,
});

export async function searchUsers(filters: stytch.SearchUsersQueryOperand[]) {
  const params: stytch.UsersSearchRequest = {
    limit: 200,
    cursor: "",
    query: {
      operator: "AND",
      operands: filters,
    },
  };

  try {
    const users = await client.users.search(params);
    return users;
  } catch (error) {
    throw error;
  }
}

export const createdBeforeNowFilter = (): stytch.SearchUsersQueryOperand => {
  return {
    filter_name: "created_at_between",
    filter_value: {
      less_than: new Date().toISOString(),
      greater_than: BEGINNING_OF_TIME,
    },
  };
};

export const emailAddressAndNameFilter = ({
  email,
  username,
}: {
  email?: string;
  username?: string;
}): stytch.SearchUsersQueryOperand[] => {
  const emailFilter = {
    filter_name: "email_address",
    filter_value: [email],
  };
  const usernameFilter = {
    filter_name: "full_name_fuzzy",
    filter_value: username?.replaceAll("@", ""),
  };
  return email ? [usernameFilter, emailFilter] : [usernameFilter];
};

export const getUsersOptions = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        email: { type: "string" },
        username: { type: "string" },
      },
      required: [],
    },
  },
} as const;

export interface GetUsersSchema {
  username?: string;
  email?: string;
}
