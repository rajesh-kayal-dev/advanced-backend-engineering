import Fastify from 'fastify';
import rootRoutes from './routes/root.js';
import authRoutes from './routes/auth.route.js'; 

import errorHandler from "./utils/error-handler.js"
import jwtPlugin from "./plugins/jwt.js";
import authPlugin from "./plugins/auth.js";
import userRoutes from './routes/user.route.js';
import taskRoutes from './routes/task.route.js';
import envPlugin from './config/env.js';
import swaggerPlugin from './plugins/swagger.js';
import corsPlugin from "./plugins/cors.js";
import healthPlugin from "./plugins/health.js";
import rateLimitPlugin from "./plugins/rate-limit.js";




const app = Fastify({
    logger: true
});

await app.register(envPlugin);
await app.register(corsPlugin);
await app.register(healthPlugin);
await app.register(rateLimitPlugin);
await app.register(swaggerPlugin);
await app.register(jwtPlugin);
await app.register(authPlugin);

await app.register(errorHandler);

await app.register(authRoutes, { prefix: '/auth' });
await app.register(userRoutes, { prefix: '/users' });
await app.register(taskRoutes, { prefix: '/tasks' });

await app.register(rootRoutes);


export default app;