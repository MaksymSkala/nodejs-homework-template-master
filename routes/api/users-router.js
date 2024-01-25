import express from 'express';
import usersController from '../../controllers/usersController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import upload from '../../middlewares/multer.js';

const router = express.Router();

router.post('/register', usersController.register);
router.get('/verify/:verificationToken', usersController.verifyEmail);
router.post('/verify', usersController.resendVerificationEmail);
router.post('/login', usersController.login);
router.post('/logout', authMiddleware, usersController.logout);
router.get('/current', authMiddleware, usersController.getCurrentUser);
router.patch('/avatars', authMiddleware, upload.single('avatar'), usersController.updateAvatar);


export default router;