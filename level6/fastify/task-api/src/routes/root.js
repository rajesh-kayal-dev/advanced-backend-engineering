
export default async function rootRoutes(app) {
    app.get('/', async () =>{
        return {
            message: "Fastify API is running",
        };
    });
}