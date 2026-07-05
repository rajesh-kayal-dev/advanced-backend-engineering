
export default async function userRoutes(app) {
    app.get(
        "/profile",
        {
            preHandler: [app.authenticate],
        },
        async (req, reply) => {
            return {
                user: req.user,
            };
        }
    );
}