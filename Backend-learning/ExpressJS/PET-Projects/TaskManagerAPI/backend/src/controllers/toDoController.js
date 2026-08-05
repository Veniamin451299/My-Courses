// path: backend/src/controllers/toDoController.js
const toDoService = require('../services/toDoService');
const { NotFoundError, InternalServerError, BadRequestError } = require('../middleware/errorHandler');
const HashIdHelper = require('../utils/hashid');
const redisClient = require('../config/redis');

class ToDoController { 
    async getAllTasks(req, res, next) { 
        try {
            const userId = req.user.id; // Получаем от какого пользоватля запрос

            const tasks = await toDoService.getAllTasks(userId);
            if (!tasks || tasks.length === 0) return next(new NotFoundError('No tasks found'))
            
            // Маскируем ID через map, создавая новые объекты (Анти-мутирование оригинала)
            const responseData = tasks.map((task) => ({
                ...task,
                id: HashIdHelper.generateHash(task.id)
            }));

            res.json(responseData);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }
    async getTaskById(req, res, next) { 
        try {
            const userId = req.user.id; // Получаем от какого пользователя запрос
            
            const taskIdDecoded = HashIdHelper.decodeHash(req.params.id);
            if(!taskIdDecoded) return next(new BadRequestError('Invalid task id'));

            const task = await toDoService.getTaskById(userId, taskIdDecoded);
            if (!task) return next(new NotFoundError('No tasks found'));

            // Маскируем ID через деструктуризацию
            const responseData = {
                ...task,
                id: HashIdHelper.generateHash(task.id)
            };

            res.json(responseData);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    } 
    
    async createTask(req, res, next) { 
        try {
            const userId = req.user.id;

            const task = await toDoService.createTask(userId, req.body);
            if (!task) return next(new NotFoundError('No tasks found'));

            // Маскируем ID через деструктуризацию
            const responseData = {
                ...task,
                id: HashIdHelper.generateHash(task.id)
            };

            res.json(responseData);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }

    async updateTask(req, res, next) { 
        try {
            const userId = req.user.id;
            const taskIdDecoded = HashIdHelper.decodeHash(req.params.id); // Какую задачу обновляем
            if(!taskIdDecoded) return next(new BadRequestError('Invalid task id'))

            const updatedTask = await toDoService.updateTask(userId, taskIdDecoded, req.body);
            if (!updatedTask) return next(new NotFoundError('No tasks found'));

            // Маскируем ID через деструктуризацию
            const responseData = {
                ...updatedTask,
                id: HashIdHelper.generateHas(updatedTask.id)
            };

            res.json(responseData);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }

    async deleteTask(req, res, next) { 
        try {
            const userId = req.user.id;

            const taskIdDecoded = HashIdHelper.decodeHash(req.params.id);
            if(!taskIdDecoded) return next(new BadRequestError('Invalid task id'))

            const deletedTask = await toDoService.deleteTask(userId, taskIdDecoded);
            if (!deletedTask) return next(new NotFoundError('No tasks found'));

            // Маскируем ID через деструктуризацию
            const responseData = {
                ...deletedTask,
                id: HashIdHelper.generateHash(deletedTask.id)
            };

            res.json(responseData);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }
}

module.exports = new ToDoController();