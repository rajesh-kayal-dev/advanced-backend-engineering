import prisma from "../config/prisma.js";

export async function createTask(userId, data) {
    return prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            userId,
        },
    });
}

export async function getTasks(userId) {
    return prisma.task.findMany({
        where:{
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },  
    });
}

export async function getTaskById(userId, taskId) {
    return prisma.task.findFirst({
        where: {
            id: Number(taskId),
            userId,
        },
    });
}

export async function updateTask(userId, taskId, data) {

    const task = await prisma.task.findFirst({
        where: {
            id: Number(taskId),
            userId,
        },
    });

    if (!task) {
        throw new Error("Task not found");
    }

    return prisma.task.update({
        where: {
            id: Number(taskId),
        },
        data,
    });
}

export async function deleteTask(userId, taskId) {
    const task = await prisma.task.findFirst({
        where: {
            id: Number(taskId),
            userId,
        },
    });

    if (!task) {
        throw new Error("Task not found");
    }
    return prisma.task.delete({
        where: {
            id: Number(taskId),
        },
    });
}

export async function getTasksWithPagination(userId, page, limit) {
  page = Number(page) || 1;
  limit = Number(limit) || 5;

  return prisma.task.findMany({
    where: {
      userId,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function searchTasks(userId, keyword) {
  return prisma.task.findMany({
    where: {
      userId,
      OR: [
        {
          title: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ],
    },
  });
}