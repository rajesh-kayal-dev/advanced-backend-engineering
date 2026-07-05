import fp from "fastify-plugin";

async function authPlugin(fastify, opts) {
    fastify.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify(); 
        } catch (error) {
            return reply.code(401).send({
                message: "Unauthorized"
            }); 
        }
    });
}

export default fp(authPlugin);