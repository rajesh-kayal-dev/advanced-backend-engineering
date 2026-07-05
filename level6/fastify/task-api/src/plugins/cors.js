import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async function (app) {
  await app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  });
});