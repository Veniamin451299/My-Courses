// path: backend/src/services/toDoService.js
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

class ToDoService {
    // GET: get all tasks
    async getAllTasks(userId) {
        return await prisma.task.findMany({ where: { userId } });
    }

    // GET: get task by id
    async getTaskById(userId, taskId) {
        return await prisma.task.findFirst({
            where: { id: taskId, userId: userId },
        });
    }

    // POST: create task
    async createTask(userId, taskData) {
        return await prisma.task.create({
            data: { ...taskData, userId },
        });
    }

    // PUT: update task
    async updateTask(taskId, taskData) {
        return await prisma.task.update({
            where: { id: taskId },
            data: taskData
        });
    }
    // DELETE: delete task
    async deleteTask(taskId) {
        return await prisma.task.delete({
            where: { id: taskId },
        });
    }
}

module.exports = new ToDoService();