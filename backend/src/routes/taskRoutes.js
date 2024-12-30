import { Router } from 'express';
import { assignTask, getTasks, updateTaskStatus } from '../controllers/taskController';

const router = Router();

// Assign a task
router.post('/assign', assignTask);

// Get all tasks
router.get('/', getTasks);

// Update task status
router.put('/:id/status', updateTaskStatus);

export default router;
