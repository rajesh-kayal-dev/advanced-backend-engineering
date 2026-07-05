import fp from "fastify-plugin";
import helmet from "@fastify/helmet";

export default fp(async function (app) {
  await app.register(helmet);
});