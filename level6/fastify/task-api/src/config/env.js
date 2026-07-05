import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";

const schema = {
  type: "object",
  required: ["DATABASE_URL", "JWT_SECRET"],
  properties: {
    DATABASE_URL: {
      type: "string",
    },
    JWT_SECRET: {
      type: "string",
    },
  },
};

export default fp(async function (app) {
  await app.register(fastifyEnv, {
    confKey: "config",
    schema,
    dotenv: true,
  });
});