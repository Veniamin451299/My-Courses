// path: backend/src/routes/toDoRouter.js
const { Router } = require('express');
const toDoController = require('../controllers/toDoController');
const { toDoSchema, validator } = require('../middleware/validators/validator');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();
router.use(authMiddleware); // Саязка автора и его задач на глобальном уровне для всех задач

// GET /api/tasks - Get all tasks
router.get('/', toDoController.getAllTasks);

// GET /api/tasks/:id - Get a task by ID
router.get('/:id', toDoController.getTaskById);

// POST /api/tasks - Create a new task
router.post('/', validator(toDoSchema), toDoController.createTask);

// PUT /api/tasks/:id - Update a task by ID
router.put('/:id', validator(toDoSchema), toDoController.updateTask);

// DELETE /api/tasks/:id - Delete a task by ID
router.delete('/:id', toDoController.deleteTask);

module.exports = router;