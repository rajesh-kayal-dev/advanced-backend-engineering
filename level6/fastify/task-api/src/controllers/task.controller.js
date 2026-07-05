import { createTask, getTasks, getTaskById, updateTask, deleteTask, getTasksWithPagination, searchTasks  } from "../services/task.service.js";

export async function create(req, reply) {
    try {
        const task = await createTask(req.user.id, req.body);

        return reply.status(201).send({
            message: "Task created successfully",
            task,
        });

    } catch (error) {
        return reply.status(500).send({
            message: "Error creating task",
            error: error.message,
        });
    }
}

export async function getAll(req, reply) {
    const tasks = await getTasks(req.user.id);
    return reply.status(200).send({
        message: "Tasks retrieved successfully",
        tasks,
    });
}

export async function getById(req, reply) {
    const task = await getTaskById(
        req.user.id,
        req.params.id
    );

    if (!task) {
        return reply.status(404).send({
            message: "Task not found",
        });
    }

    return reply.send({
        task,
    });

}

export async function update(req, reply) {
    try {

        const task = await updateTask(
            req.user.id,
            req.params.id,
            req.body
        );

        return reply.status(200).send({
            message: "Task updated successfully",
            task,
        });


    } catch (error) {
        return reply.status(500).send({
            message: "Error updating task",
            error: error.message,
        });
    }
}

export async function remove(req, reply) {
    try {
        await deleteTask(req.user.id, req.params.id);

        return reply.status(200).send({
            message: "Task deleted successfully",
        });
    } catch (error) {
        return reply.status(500).send({
            message: "Error deleting task",
            error: error.message,
        });
    }
}

export async function getPagination(req, reply) {
  const { page, limit } = req.query;

  const tasks = await getTasksWithPagination(
    req.user.id,
    page,
    limit
  );

  return reply.send(tasks);
}

export async function search(req, reply) {
  const { keyword } = req.query;

  const tasks = await searchTasks(req.user.id, keyword);

  return reply.send(tasks);
}