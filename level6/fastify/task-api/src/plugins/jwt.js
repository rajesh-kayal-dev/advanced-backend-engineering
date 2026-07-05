import fp from "fastify-plugin";
import jwt from "@fastify/jwt";

async function jwtPlugin(app) {
    app.register(jwt, {
        secret: app.config.JWT_SECRET,
    });
}

export default fp(jwtPlugin);