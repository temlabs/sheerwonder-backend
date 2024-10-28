import fastify from "fastify";
import fastifyPostgress from "@fastify/postgres";
import {
  createdBeforeNowFilter,
  emailAddressAndNameFilter,
  searchUsers,
} from "./src/auth/stytch/searchUsers";
import { LoginBodySchema, login, loginOptions } from "./src/auth/stytch/login";
import { StytchError } from "stytch";
import {
  SignUpBodySchema,
  confirmSignUpOptions,
  signUp,
  signUpOptions,
} from "./src/auth/stytch/signUp";
import {
  addUserToDatabase,
  readDatabaseUser,
} from "./src/postgres/users/userFunctions";
import {
  CreateDBShortPostParams,
  createShortPostOptions,
} from "./src/routes/createShortPost";
import { readShortPosts } from "./src/postgres/shortPosts/postFunctions";
import {
  CreateDBTrackParams,
  createTrackOptions,
} from "./src/routes/createTrack";
import {
  ReadShortPostQueryStringParams,
  readShortPostFilterSchema,
  readShortPostOptions,
} from "./src/routes/readShortPosts";
import { SortBy } from "./src/postgres/filterTypes";
import { GetUserSchema, getUserOptions } from "./src/routes/getUser";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoConfig } from "./src/auth/cognito/config";
import {
  CognitoSignUpErrorNames,
  awsSignUp,
  cognitoSignUpErrorMap,
  cognitoSignUpErorrNames,
} from "./src/auth/cognito/functions/signUp";
import {
  ConfirmSignUpRequestBody,
  SignUpRequestBody,
} from "./src/auth/authTypes";
import { PoolClient } from "pg";
import { User } from "./src/postgres/users/userTypes";
import { getCognitoError } from "./src/auth/cognito/utils";
import { listCognitoUsers } from "./src/auth/cognito/functions/listUsers";
import {
  CognitoConfirmSignUpErrorNames,
  awsConfirmSignUp,
  cognitoConfirmSignUpErrorMap,
  cognitoConfirmSignUpErrorNames,
} from "./src/auth/cognito/functions/confirmSignUp";
import {
  GetUsersSchema,
  getUsersOptions,
} from "./src/postgres/users/getUsers/getUserSchema";
import { getUsers } from "./src/postgres/users/getUsers/getUsers";
import { S3Client } from "@aws-sdk/client-s3";
import { getAvatarUploadUrl } from "./src/postgres/users/getAvatarUploadUrl/getAvatarUploadUrl";
import {
  EditUserBodySchema,
  EditUserQueryStringSchema,
  editUserOptions,
} from "./src/postgres/users/editUser/editUserSchema";
import { editUser } from "./src/postgres/users/editUser/editUser";
import cognitoAuthDecorator from "./src/auth/cognito/decorators/cognitoAuthDecorator";
import { CreateShortPostBody } from "./src/postgres/shortPosts/shortPostTypes";
import { createShortPost } from "./src/postgres/shortPosts/createShortPost/createShortPost";
import { upvotePostOptions } from "./src/routes/upvotePost";
import { createUpvote } from "./src/postgres/shortPosts/createUpvote/createUpvote";
import {
  GetSpotifyTokensBody,
  RefreshAccessTokenBody,
} from "./src/spotify/types";
import { getSpotifyTokensOptions } from "./src/spotify/getSpotifyTokens";
import {
  fetchSpotifyAuthorizationTokens,
  refreshSpotifyAccessToken,
} from "./src/spotify/functions";
import { refreshAccessTokenOptions } from "./src/spotify/refreshAccessToken";
import { constructSpotifyLoginUri } from "./src/spotify/getSpotifyLoginUrl";

require("dotenv").config();
const fs = require("fs");
let serverOptions = {};
if (process.env.NODE_ENV === "dev") {
  const privateKeyPath = "C:\\localhost.key";
  const certificatePath = "C:\\localhost.crt";
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");
  const certificate = fs.readFileSync(certificatePath, "utf8");
  //pls deploy
  const credentials = { key: privateKey, cert: certificate };
  serverOptions = { https: credentials };
}

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

declare module "fastify" {
  interface FastifyRequest {
    user: {
      sub: string;
      email: string;
    };
  }
}

const server = fastify(serverOptions);

const port = (process.env.PORT as unknown as number) || 3000;

server.register(fastifyPostgress, {
  connectionString: process.env.DATABASE_URL,
});
server.decorate("authenticate", cognitoAuthDecorator);

server.get("/", async (request, reply) => {
  return "hello world, what's good?!\n";
});

server.post("/signUp", signUpOptions, async (request, reply) => {
  const { email, password, username } = request.body as SignUpRequestBody;
  let dbClient: PoolClient | undefined;

  try {
    const matchingUsers = await listCognitoUsers(cognitoClient, email);

    if (matchingUsers.Users && matchingUsers.Users?.length > 0) {
      reply.status(400).send({
        error: {
          message: "A user with this email already exists",
          code: 400,
          field: "email",
          internalCode: "UserExists",
        },
      });
    } else {
      dbClient = await server.pg.connect();
      const awsSignUpResponse = await awsSignUp(cognitoClient, {
        email,
        password,
        username,
      });
      const user_sub = awsSignUpResponse.UserSub!;
      const userRow = await addUserToDatabase(dbClient, {
        username,
        user_sub,
        email,
      });
      const {
        id,
        avatar_url,
        bio,
        display_name,
        follower_count,
        following_count,
      } = userRow[0];
      const userResponse: User = {
        id,
        bio: bio ?? undefined,
        avatarUrl: avatar_url ?? undefined,
        followerCount: follower_count,
        followingCount: following_count,
        displayName: display_name ?? "",
        username,
      };
      reply.status(201).send(userResponse);
    }
  } catch (error) {
    const cognitoError = getCognitoError<
      CognitoSignUpErrorNames,
      SignUpRequestBody
    >(error, cognitoSignUpErorrNames, cognitoSignUpErrorMap);
    const errObj = error as Error;
    if (cognitoError) {
      reply.status(cognitoError.code).send({ error: cognitoError });
    } else {
      console.error(error);
      reply.status(500).send({
        error: {
          message: "We're so sorry, there seems to be an error",
          code: 500,
          internalCode: "Error",
        },
      });
    }
  } finally {
    dbClient && dbClient.release();
  }
});

server.post("/confirmSignUp", confirmSignUpOptions, async (request, reply) => {
  const { confirmationCode, username } =
    request.body as ConfirmSignUpRequestBody;
  let dbClient: PoolClient | undefined;
  try {
    dbClient = await server.pg.connect();
    await awsConfirmSignUp(cognitoClient, {
      confirmationCode,
      username,
    });
    const userRow = await readDatabaseUser(dbClient, { username });
    if (!userRow || userRow.length === 0) {
      reply.status(404).send({
        error: {
          code: 404,
          message: "This user doesn't exist, please create another",
          field: "confirmationCode",
          internalCode: "UserNonExistent",
        },
      });
    } else {
      const { id, avatarUrl, bio, displayName, followerCount, followingCount } =
        userRow[0];
      const userResponse: User = {
        id,
        bio: bio ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        followerCount: followerCount,
        followingCount: followingCount,
        displayName: displayName ?? "",
        username,
      };
      reply.status(201).send(userResponse);
    }
  } catch (error) {
    const cognitoError = getCognitoError<
      CognitoConfirmSignUpErrorNames,
      ConfirmSignUpRequestBody
    >(error, cognitoConfirmSignUpErrorNames, cognitoConfirmSignUpErrorMap);
    const errObj = error as Error;
    if (cognitoError) {
      reply.status(cognitoError.code).send({ error: cognitoError });
    } else {
      reply.status(500).send({
        error: {
          message: "We're so sorry, there seems to be an error",
          code: 500,
          internalCode: "Error",
        },
      });
    }
  } finally {
    dbClient && dbClient.release();
  }
});

server.get(
  "/avatarUploadUrl",
  { preHandler: server.authenticate() },
  async (request, reply) => {
    let dbClient;

    try {
      dbClient = await server.pg.connect();
      const user = (
        await readDatabaseUser(dbClient, { user_sub: request.user.sub })
      )[0];

      const userId = user.id;
      console.debug("upload URL got user id: ", userId);
      const url = await getAvatarUploadUrl(s3Client, userId);
      console.debug("upload URL got upload url: ", url);
      reply.header("Content-Type", "application/json");
      reply.status(200).send({ url });
    } catch (error) {
      reply.status(500).send({
        error: {
          message: "We're so sorry, there seems to be an error",
          code: 500,
        },
      });
    } finally {
      dbClient && dbClient.release();
    }
  }
);

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.get("/names", async (request, reply) => {
  const dbClient = await server.pg.connect();
  try {
    const { rows } = await dbClient.query("SELECT * FROM test");

    return rows;
  } catch (err) {
    console.error(err);
    reply.status(500).send("Error querying the database");
  } finally {
    dbClient.release();
  }
});

server.get<{ Querystring: GetUsersSchema }>(
  "/users",
  getUsersOptions,
  async (request, reply) => {
    const dbClient = await server.pg.connect();
    try {
      const { email = "", username = "", displayName = "", id } = request.query;
      const users = await getUsers(dbClient, {
        email,
        username,
        displayName,
        id,
      });
      reply.status(200).send(users);
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error querying the database");
    } finally {
      dbClient.release();
    }
  }
);

server.patch<{
  Querystring: EditUserQueryStringSchema;
  Body: EditUserBodySchema;
}>(
  "/user",
  { ...editUserOptions, preHandler: server.authenticate() },
  async (request, reply) => {
    const sub = request.user.sub;
    const dbClient = await server.pg.connect();
    try {
      const body = request.body;
      const { id } = request.query;
      const updatedUser = ((await editUser(dbClient, id, body)) as User[])[0];
      reply.status(200).send(updatedUser);
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error querying the database");
    } finally {
      dbClient.release();
    }
  }
);

server.get<{ Querystring: GetUserSchema }>(
  "/user",
  { ...getUserOptions, preHandler: server.authenticate() },
  async (request, reply) => {
    const user_sub = request.user?.sub;
    const dbClient = await server.pg.connect();
    try {
      const { userId = undefined } = request.query;
      const users = await readDatabaseUser(dbClient, { id: userId, user_sub });
      if (users.length === 0) {
        reply.status(404).send("User not found");
        return;
      }

      return users[0];
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error querying the database");
    } finally {
      dbClient.release();
    }
  }
);

server.post("/login", loginOptions, async (request, reply) => {
  const body: LoginBodySchema = request.body as LoginBodySchema;

  try {
    const res = await login(body);
    return res;
  } catch (error) {
    console.error(error);
    if (error instanceof StytchError) {
      reply.status(error.status_code).send({
        message: error.error_message,
        name: error.name,
        type: error.error_type,
      });
      return;
    }
    reply.status(500).send("Error querying the database");
  }
});

server.post<{ Body: CreateShortPostBody }>(
  "/shortPost",
  { ...createShortPostOptions, preHandler: server.authenticate() },
  async (request, reply) => {
    const body = request.body;
    let dbClient;
    try {
      dbClient = await server.pg.connect();
      const user = (
        await readDatabaseUser(dbClient, { user_sub: request.user.sub })
      )[0];
      const userId = user.id;
      const res = await createShortPost(dbClient, { ...body, userId });
      reply.header("Content-Type", "application/json");
      console.debug("sending res: ", { ...res });
      reply.status(201).send({ ...res });
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error querying the database");
    } finally {
      dbClient && dbClient.release();
    }
  }
);

server.post<{ Body: GetSpotifyTokensBody }>(
  "/spotify/tokens",
  {
    ...getSpotifyTokensOptions,
    preHandler: server.authenticate(),
  },
  async (request, reply) => {
    const authCode = request.body.authCode;
    try {
      console.debug({ authCode });
      const tokens = await fetchSpotifyAuthorizationTokens(authCode);
      return tokens;
    } catch (error) {
      console.error(error);
      reply.code(500).send({
        error: {
          message: (error as Error).message,
          code: "SpotifyAuth",
          internalCode: "SpotifyAuth",
        },
      });
    }
  }
);

server.post<{ Body: RefreshAccessTokenBody }>(
  "/spotify/tokens/refresh",
  {
    ...refreshAccessTokenOptions,
    preHandler: server.authenticate(),
  },
  async (request, reply) => {
    const refreshToken = request.body.refreshToken;
    try {
      const tokens = await refreshSpotifyAccessToken(refreshToken);
      return tokens;
    } catch (error) {
      console.error(error);
      reply.code(500).send({
        error: {
          message: (error as Error).message,
          code: "SpotifyAuth",
          internalCode: "SpotifyAuth",
        },
      });
    }
  }
);

server.get(
  "/spotify/login",
  { preHandler: server.authenticate() },
  async (request, reply) => {
    const loginUriAndState = constructSpotifyLoginUri();
    reply.send(loginUriAndState);
  }
);

server.get<{
  Querystring: ReadShortPostQueryStringParams & {
    offset?: number;
    sort_by?: SortBy;
    limit?: number;
  };
}>(
  "/shortPost",
  { ...readShortPostOptions, preHandler: server.authenticate() },
  async (request, reply) => {
    // console.debug(readShortPostOptions);

    const filters = request.query;
    const offset = filters.offset;
    const sortBy = filters.sort_by;
    const limit = filters.limit;
    delete filters.sort_by;
    delete filters.offset;

    const dbClient = await server.pg.connect();
    const user = (
      await readDatabaseUser(dbClient, { user_sub: request.user.sub })
    )[0];
    const userId = user.id;
    try {
      const res = await readShortPosts(
        dbClient,
        filters,
        readShortPostFilterSchema,
        offset?.toString(),
        limit?.toString(),
        sortBy,
        userId
      );

      return res;
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error querying the database");
    } finally {
      dbClient.release();
    }
  }
);

server.post<{ Querystring: { id: number } }>(
  "/upvote",
  { ...upvotePostOptions, preHandler: server.authenticate() },
  async (request, reply) => {
    const postId = request.query.id;
    let dbClient;
    try {
      dbClient = await server.pg.connect();

      const user = (
        await readDatabaseUser(dbClient, { user_sub: request.user.sub })
      )[0];
      const userId = user.id;
      await createUpvote(dbClient, postId, userId);
      reply.header("Content-Type", "application/json");
      reply.status(201);
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error querying the database");
    } finally {
      dbClient && dbClient.release();
    }
  }
);

server.listen(
  {
    port: port,
    host: process.env.NODE_ENV === "dev" ? "127.0.0.1" : "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
