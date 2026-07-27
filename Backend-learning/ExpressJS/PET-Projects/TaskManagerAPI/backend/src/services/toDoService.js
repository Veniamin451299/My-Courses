// path: backend/src/services/toDoService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ToDoService {
    // GET: get all tasks
    async getAllTasks() {
        return await prisma.task.findMany();
    }

    // GET: get task by id
    async getTaskById(id) {
        return await prisma.task.findUnique({
            where: { id: Number(id) },
        });
    }

    // POST: create task
    async createTask(task) {
        return await prisma.task.create({
            data: task,
        });
    }

    // PUT: update task
    async updateTask(id, task) {
        return await prisma.task.update({
            where: { id: Number(id) },
            data: task,
        });
    }
    // DELETE: delete task
    async deleteTask(id) {
        return await prisma.task.delete({
            where: { id: Number(id) },
        });
    }
}

module.exports = new ToDoService();