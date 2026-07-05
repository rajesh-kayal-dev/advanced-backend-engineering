import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async function (app) {
    await app.register(swagger, {
        openapi: {
            info: {
                title: "Task API",
                description: "Task Management API",
                version: "1.0.0",
            },
        },
    });

    await app.register(swaggerUI, {
        routePrefix: "/docs",
    });
    app.log.info("Swagger Plugin Registered");

});