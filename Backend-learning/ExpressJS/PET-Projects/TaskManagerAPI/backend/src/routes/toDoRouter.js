// path: backend/src/routes/toDoRouter.js
const { Router } = require('express');
const toDoController = require('../controllers/toDoController');
const { toDoSchema, validator } = require('../middleware/validators/validator');

const router = Router();

// GET /todo/tasks - Get all tasks
router.get('/', toDoController.getAllTasks);

// GET /todo/tasks/:id - Get a task by ID
router.get('/:id', toDoController.getTaskById);

// POST /todo/tasks - Create a new task
router.post('/', validator(toDoSchema), toDoController.createTask);

// PUT /todo/tasks/:id - Update a task by ID
router.put('/:id', validator(toDoSchema), toDoController.updateTask);

// DELETE /todo/tasks/:id - Delete a task by ID
router.delete('/:id', toDoController.deleteTask);

module.exports = router;