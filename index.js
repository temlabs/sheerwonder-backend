"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
require("dotenv").config();
const server = (0, fastify_1.default)();
const port = process.env.PORT || 3000;
server.get("/", async (request, reply) => {
    return "hello world!\n";
});
server.get("/ping", async (request, reply) => {
    return "pong\n";
});
server.listen({
    port: port,
    host: (process.env.NODE_ENV = "dev" ? "127.0.0.1" : "0.0.0.0"),
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
