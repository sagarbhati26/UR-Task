import { Router } from 'express';
import { registerUser, loginUser, getUsers } from '../controllers/userController';

const router = Router();

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Get all users (for manager role)
router.get('/', getUsers);

export default router;
