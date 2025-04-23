import { Router } from 'express';
import { registerUser, loginUser, logoutUser} from '../controllers/userController.js'; // Adjust the path as needed

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout',logoutUser)


export default router; // Default export
