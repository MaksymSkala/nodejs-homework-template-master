import express from 'express';
import usersController from '../../controllers/usersController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', usersController.register);
router.post('/login', usersController.login);
router.post('/logout', authMiddleware, usersController.logout);
router.get('/current', authMiddleware, usersController.getCurrentUser);

export default router;