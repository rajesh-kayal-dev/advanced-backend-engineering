import { login, logout, refresh, register } from '../controllers/auth.controller.js';
import { loginSchema, refreshSchema, registerSchema } from '../schemas/auth.schema.js';

export default async function authRoutes(app) {
    app.post("/register", {
        schema: registerSchema,
    }, register);

    app.post("/login", {
        schema: loginSchema,
    },
        login);

    app.post(
        "/logout",
        {
            preHandler: [app.authenticate],
        },
        logout
    );
    app.post(
        "/refresh",
        {
            schema: refreshSchema,
        },
        refresh
    );
}