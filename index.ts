import fastify from "fastify";
import fastifyPostgress from "@fastify/postgres";
import {
  GetUsersSchema,
  createdBeforeNowFilter,
  emailAddressAndNameFilter,
  getUsersOptions,
  searchUsers,
} from "./src/auth/stytch/searchUsers";

require("dotenv").config();

const server = fastify();
const port = (process.env.PORT as unknown as number) || 3000;

server.register(fastifyPostgress, {
  connectionString: process.env.DATABASE_URL,
});

server.get("/", async (request, reply) => {
  return "hello world hiiii!\n";
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
    } catch (err) {
      console.error(err);
      reply.status(500).send("Error querying the database");
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
