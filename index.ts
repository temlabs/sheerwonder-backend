import fastify from "fastify";
import fastifyPostgress from "@fastify/postgres";
import {
  GetUsersSchema,
  createdBeforeNowFilter,
  emailAddressAndNameFilter,
  getUsersOptions,
  searchUsers,
} from "./src/auth/stytch/searchUsers";
import { LoginBodySchema, login, loginOptions } from "./src/auth/stytch/login";
import { StytchError } from "stytch";
import {
  SignUpBodySchema,
  signUp,
  signUpOptions,
} from "./src/auth/stytch/signUp";
import { createDatabaseUser } from "./src/postgres/users/userFunctions";
import {
  CreateDBShortPostParams,
  createShortPostOptions,
} from "./src/routes/createShortPost";
import {
  createShortPost,
  readShortPosts,
} from "./src/postgres/shortPosts/postFunctions";
import {
  CreateDBTrackParams,
  createTrackOptions,
} from "./src/routes/createTrack";
import { createTrack } from "./src/postgres/tracks/trackFunctions";
import {
  ReadShortPostQueryStringParams,
  readShortPostFilterSchema,
  readShortPostOptions,
} from "./src/routes/readShortPosts";
import { SortBy } from "./src/postgres/filterTypes";

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
const server = fastify(serverOptions);

const ser = fastify();

const port = (process.env.PORT as unknown as number) || 3000;

server.register(fastifyPostgress, {
  connectionString: process.env.DATABASE_URL,
});

server.get("/", async (request, reply) => {
  return "hello world, what's good?!\n";
});

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.get("/names", async (request, reply) => {
  try {
    const dbClient = await server.pg.connect();
    const { rows } = await dbClient.query("SELECT * FROM test");
    dbClient.release();
    return rows;
  } catch (err) {
    console.error(err);
    reply.status(500).send("Error querying the database");
  }
});

server.get<{ Querystring: GetUsersSchema }>(
  "/userExists",
  getUsersOptions,
  async (request, reply) => {
    try {
      const { email = "", username = "" } = request.query;
      const { results: users } = await searchUsers([
        createdBeforeNowFilter(),
        ...emailAddressAndNameFilter({ email, username }),
      ]);
      if (users.length === 0) {
        return false;
      }
      const user = users[0];
      if (username) {
        return user.name?.first_name === username.replaceAll("@", "");
      }
      return !!user;
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error querying the database");
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

server.post("/signUp", signUpOptions, async (request, reply) => {
  const body: SignUpBodySchema = request.body as SignUpBodySchema;

  try {
    const res = await signUp(body);
    const dbClient = await server.pg.connect();
    const dbUser = await createDatabaseUser(dbClient, res.userId);
    dbClient.release();
    return { ...res, user: dbUser[0] };
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

server.post(
  "/createShortPost",
  createShortPostOptions,
  async (request, reply) => {
    const body: CreateDBShortPostParams =
      request.body as CreateDBShortPostParams;

    try {
      const dbClient = await server.pg.connect();
      const res = await createShortPost(dbClient, body);
      dbClient.release();
      return { ...res };
    } catch (error) {
      console.error(error);
      reply.status(500).send("Error querying the database");
    }
  }
);

server.post("/createTrack", createTrackOptions, async (request, reply) => {
  const body: CreateDBTrackParams = request.body as CreateDBTrackParams;

  try {
    const dbClient = await server.pg.connect();
    const res = await createTrack(dbClient, body);
    dbClient.release();
    return { ...res[0] };
  } catch (error) {
    console.error(error);
    reply.status(500).send("Error querying the database");
  }
});

server.get<{
  Querystring: ReadShortPostQueryStringParams & {
    offset?: string;
    sort_by?: SortBy;
  };
}>("/shortPosts", readShortPostOptions, async (request, reply) => {
  // console.debug(readShortPostOptions);
  const filters = request.query;
  const offset = filters.offset;
  const sortBy = filters.sort_by;
  delete filters.sort_by;
  delete filters.offset;

  try {
    const dbClient = await server.pg.connect();
    const res = await readShortPosts(
      dbClient,
      filters,
      readShortPostFilterSchema,
      offset,
      sortBy
    );
    dbClient.release();
    return res;
  } catch (error) {
    console.error(error);
    reply.status(500).send("Error querying the database");
  }
});

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
