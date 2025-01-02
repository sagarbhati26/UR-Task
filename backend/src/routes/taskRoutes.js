import { Router } from 'express';
import  body  from 'express-validator';
import { assignTask, getTasks, updateTaskStatus } from '../controllers/taskController.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = Router();

// Assign a task with validation
router.post(
  '/assign',
 
  assignTask
);

// Get all tasks
router.get('/', getTasks);

// Update task status
router.put(
  '/:id/status',
  
  updateTaskStatus
);

export default router;
