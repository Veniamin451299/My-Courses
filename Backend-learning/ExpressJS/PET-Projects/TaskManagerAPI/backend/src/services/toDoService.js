// path: backend/src/services/toDoService.js
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const redis = require('../config/redis');

class ToDoService {
    /** GET: get all tasks
     * @param {string} userId - user id
     * @returns {Promise<Array>} - array of tasks
     **/
    async getAllTasks(userId) {
        const cacheKey = `tasks:${userId}`; // Создаем ключ для кэширования

        // Пробуем взять из кэша
        try{
            const cachedTasks = await redis.get(cacheKey);
            if (cachedTasks) return JSON.parse(cachedTasks);
        } catch (redisError) {
            console.error('Redis Error (GET): ', redisError);
        }
        // Если в кэша нет, берем из БД
        const tasks = await prisma.task.findMany({ where: { userId } });

        // Если задачи есть, то кэшируем
        if (tasks && tasks.length > 0) {
            try{
                await redis.set(cacheKey, JSON.stringify(tasks), { EX: 3600 });
            } catch (redisError) {
                console.error('Redis Error (SET): ', redisError);
            }
        }
        return tasks;
    }

    /** GET: get task by id
     * @param {string} userId - user id
     * @param {string} taskId - task id
     * @returns {Promise<Object>} - task
     **/
    async getTaskById(userId, taskId) {
        const cacheKey = `task:${userId}:${taskId}`; // Создаем ключ для кэширования

        try{
            const cachedTask = await redis.get(cacheKey);
            if (cachedTask) return JSON.parse(cachedTask);
        } catch (redisError) {
            console.error('Redis Error (GET): ', redisError);
        }

        const task = await prisma.task.findFirst({
            where: { id: taskId, userId: userId },
        });

        if (task) {
            try{
                await redis.set(cacheKey, JSON.stringify(task), { EX: 3600 });
            } catch (redisError) {
                console.error('Redis Error (SET): ', redisError);
            }
        }
        return task
    }

    /** POST: create task
     * @param {string} userId - user id
     * @param {Object} taskData - task data
     * @returns {Promise<Object>} - created task
     **/
    async createTask(userId, taskData) {
        const createdTask = await prisma.task.create({
            data: { ...taskData, userId },
        });

        // Инвалидация кэша
        try {
            await redis.del(`tasks:${userId}`);
        } catch (redisError) {
            console.error('Redis Error (DEL): ', redisError);
        }

        return createdTask;
    }
           

    /** PUT: update task
     * @param {string} userId - user id
     * @param {string} taskId - task id
     * @param {Object} updateData - update data
     * @returns {Promise<Object>} - updated task
     **/
    async updateTask(userId, taskId, updateData) {
        try {
            const updated = await prisma.task.update({
                where: { id_userId: { id: taskId, userId: userId }},
                data: updateData
            });

            // Инвалидация кэша
            try {
                await redis.del(`tasks:${userId}`);
                await redis.del(`task:${userId}:${taskId}`);
            } catch (redisError) {
                console.error('Redis Error (DEL): ', redisError);
            }

            return updated;
        } catch (error) {
            // Код ошибки P2025 в Prisma означает, что запись для обновления не найдена
            if (error.code === 'P2025') return null;
            console.error('Service Update Error: ', error);          
            throw error;
        }
    }
    /** DELETE: delete task
     * @param {string} userId - user id
     * @param {string} taskId - task id
     * @returns {Promise<Object>} - deleted task
     **/
    async deleteTask(userId, taskId) {
        try {
            const deleted = await prisma.task.delete({
            where:{ id_userId: { id: taskId, userId: userId } },
            });

            // Инвалидация кэша
            try {
                await redis.del(`tasks:${userId}`);
                await redis.del(`task:${userId}:${taskId}`);
            } catch (redisError) {
                console.error('Redis Error (DEL): ', redisError);
            }
            return deleted;
        } catch (error) {
            // Код ошибки P2025 в Prisma означает, что запись для удаления не найдена
            if (error.code === 'P2025') return null;
            console.error('Service Delete Error: ', error);          
            throw error;
        }
    }
}

module.exports = new ToDoService();