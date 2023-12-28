import fastify from "fastify";

require("dotenv").config();

const server = fastify();
const port = (process.env.PORT as unknown as number) || 3000;

server.get("/", async (request, reply) => {
  return "hello world!\n";
});

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.listen(
  {
    port: port,
    host: (process.env.NODE_ENV = "dev" ? "127.0.0.1" : "0.0.0.0"),
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
