// path: backend/src/controllers/toDoController.js
const toDoService = require('../services/toDoService');
const { NotFoundError, InternalServerError, BadRequestError } = require('../middleware/errorHandler');
const HashIdHelper = require('../utils/hashid');
const redisClient = require('../config/redis');

class ToDoController { 
    async getAllTasks(req, res, next) { 
        try {
            const userId = req.user.id; // Получаем от какого пользоватля запрос
            const cacheKey = `tasks:${userId}`; // Создаем ключ для кэширования

            // Доставаем из кэша данных
            let cachedTasks = null;
            try{
                cachedTasks = await redisClient.get(cacheKey);
            } catch (redisError) {
                console.error('Redis is not available. Gping to database');
            }

            // Если данные есть в кэше, то возвращаем их
            if (cachedTasks) { 
                const parsedTasks = JSON.parse(cachedTasks);   // Парсим кэш в JSON
                // Маскируем id задач перед отправкой
                parsedTasks.forEach(task => task.id = HashIdHelper.generateHash(task.id));
                return res.json(parsedTasks);
            }

            const tasks = await toDoService.getAllTasks(userId);
            if (!tasks) return next(new NotFoundError('No tasks found'));
            
            // Сохраняем данные в кэш
            await redisClient.set(cacheKey, JSON.stringify(tasks), { EX: 3600 });
            tasks.forEach(task => task.id = HashIdHelper.generateHash(task.id));
            res.json(tasks);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }
    async getTaskById(req, res, next) { 
        try {
            const userId = req.user.id; // Получаем от какого пользователя запрос
            
            const taskIdDecoded = HashIdHelper.decodeHash(req.params.id);
            if(!taskIdDecoded) return next(new BadRequestError('Invalid task id'));

            const cacheKey = `task:${userId}:${taskIdDecoded}`; // Создаем ключ для кэша

            // Доставаем из кэша данных
            let cachedTasks = null;
            try{
                cachedTasks = await redisClient.get(cacheKey);
            } catch (redisError) {
                console.error('Redis is not available. Gping to database');
            }

            if (cachedTask) { 
                const parsedTask = JSON.parse(cachedTask); // Парсим кэш в JSON
                // Мaskируем id задачи перед отправкой
                parsedTask.id = HashIdHelper.generateHash(parsedTask.id);
                return res.json(parsedTask);
            }

            const task = await toDoService.getTaskById(userId, taskIdDecoded);
            if (!task) return next(new NotFoundError('No tasks found'));

            // Сохраняем данные в кэш
            await redisClient.set(cacheKey, JSON.stringify(task), { EX: 3600 });
            task.id = HashIdHelper.generateHash(task.id);
            res.json(task);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    } 
    
    async createTask(req, res, next) { 
        try {
            const userId = req.user.id;

            const task = await toDoService.createTask(userId, req.body);
            if (!task) return next(new NotFoundError('No tasks found'));


            task.id = HashIdHelper.generateHash(task.id);
            
            // Удаляем кэш
            await redisClient.del(`tasks:${userId}`);
            res.json(task);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }

    async updateTask(req, res, next) { 
        try {
            const userId = req.user.id;
            const taskIdDecoded = HashIdHelper.decodeHash(req.params.id); // Какую задачу обновляем
            
            if(!taskIdDecoded) return next(new BadRequestError('Invalid task id'))

            // БЕЗОПАСНОСТЬ: Ищем задачу в БД, проверяя, что она принадлежит ИМЕННО ЭТОМУ пользователю
            const existTask = await toDoService.getTaskById(userId, taskIdDecoded);
            // Если задача не найдена или принадлежит другому юзеру — отдаем 404 (скрываем факт её существования)
            if(!existTask) return next(new NotFoundError('Task not found in database'));

            // Если всё ок — обновляем
            const updatedTask = await toDoService.updateTask(taskIdDecoded, req.body);
            updatedTask.id = HashIdHelper.generateHash(updatedTask.id);

            // Удаляем кэш, стираем и список, и кэш этой конкретной задачи
            await redisClient.del(`tasks:${userId}`);
            await redisClient.del(`task:${userId}:${taskIdDecoded}`); // кэш одиночной задачи
            res.json(updatedTask);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }

    async deleteTask(req, res, next) { 
        try {
            const userId = req.user.id;

            const taskIdDecoded = HashIdHelper.decodeHash(req.params.id);
            if(!taskIdDecoded) return next(new BadRequestError('Invalid task id'))

            const existTask = await toDoService.getTaskById(userId, taskIdDecoded);
            if(!existTask) return next(new NotFoundError('Task not found in database'));

            const deletedTask = await toDoService.deleteTask(taskIdDecoded);
            deletedTask.id = HashIdHelper.generateHash(deletedTask.id);

            // Удаляем кэш, стираем и список, и кэш этой конкретной задачи
            await redisClient.del(`tasks:${userId}`);
            await redisClient.del(`task:${userId}:${taskIdDecoded}`); // кэш одиночной задачи
            res.json(deletedTask);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }
}

module.exports = new ToDoController();