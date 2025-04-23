import { Router } from 'express';
import  body  from 'express-validator';
import { assignTask, getTasks, updateTaskStatus } from '../controllers/taskController.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = Router();


router.post(
  '/assign',
 
  assignTask
);


router.post('/gettasks', getTasks);


router.put(
  '/:id/status',
  
  updateTaskStatus
);

export default router;
