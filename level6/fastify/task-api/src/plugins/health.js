import fp from "fastify-plugin";

export default fp(async function (app) {
  app.get("/health", async () => {
    return {
      status: "OK",
    };
  });
});