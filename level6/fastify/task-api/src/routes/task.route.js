import { create, getAll, getById, update, remove, getPagination, search } from "../controllers/task.controller.js"
import { createTaskSchema, paginationSchema, searchSchema, updateTaskSchema } from "../schemas/task.schema.js";



export default async function taskRoutes(app) {
    app.post(
        "/",
        {
            preHandler: [app.authenticate],
            schema: createTaskSchema,
        },
        create,
    );

    app.get(
        "/",
        {
            preHandler: [app.authenticate],
        },
        getAll
    );

    app.get(
        "/:id",
        {
            preHandler: [app.authenticate],
        },
        getById
    );

    app.patch(
        "/:id",
        {
            preHandler: [app.authenticate],
            schema: updateTaskSchema,
        },
        update
    );

    app.delete(
        "/:id",
        {
            preHandler: [app.authenticate],
        },
        remove
    );
    app.get(
        "/pagination",
        {
            preHandler: [app.authenticate],
            schema: paginationSchema,
        },
        getPagination
    );

    app.get(
        "/search",
        {
            preHandler: [app.authenticate],
            schema: searchSchema,
        },
        search
    );
}