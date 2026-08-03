// path: backend/src/controllers/toDoController.js
const toDoService = require('../services/toDoService');
const { NotFoundError, InternalServerError, BadRequestError } = require('../middleware/errorHandler');
const HashIdHelper = require('../utils/hashid');

class ToDoController { 
    async getAllTasks(req, res, next) { 
        try {
            const userId = req.user.id;

            const tasks = await toDoService.getAllTasks(userId);
            if (!tasks) return next(new NotFoundError('No tasks found'));
            
            tasks.forEach(task => task.id = HashIdHelper.generateHash(task.id));
            res.json(tasks);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }
    async getTaskById(req, res, next) { 
        try {
            const userId = req.user.id;
            
            const idDecoded = HashIdHelper.decodeHash(req.params.id);
            if(!idDecoded) return next(new BadRequestError('Invalid task id'));

            const task = await toDoService.getTaskById(userId, idDecoded);
            if (!task) return next(new NotFoundError('No tasks found'));

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
            res.json(deletedTask);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }
}

module.exports = new ToDoController();