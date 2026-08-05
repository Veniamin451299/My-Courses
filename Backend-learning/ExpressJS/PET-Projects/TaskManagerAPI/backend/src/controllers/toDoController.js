// path: backend/src/controllers/toDoController.js
const toDoService = require('../services/toDoService');
const { NotFoundError, InternalServerError, BadRequestError } = require('../middleware/errorHandler');
const HashIdHelper = require('../utils/hashid');
const redisClient = require('../config/redis');

class ToDoController { 
    /** list of tasks
     * @route GET /api/tasks
     * @description Get all tasks of current user
     * @access Private
     **/
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
    /** Get task by ID
     * @route GET /api/tasks/:id
     * @description Get a task by ID
     * @access Private
     **/
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
    
    /** Create task
     * @route POST /api/tasks
     * @description Create a task
     * @access Private
     **/
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

    /** Update task
     * @route PUT /api/tasks/:id
     * @description Update a task
     * @access Private
     **/
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
                id: HashIdHelper.generateHash(updatedTask.id)
            };

            res.json(responseData);
        } catch (error) {
            next(new InternalServerError(`Internal Server Error: ${error.message}`));
        }
    }

    /** Delete task
     * @route DELETE /api/tasks/:id
     * @description Delete a task
     * @access Private
     **/
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