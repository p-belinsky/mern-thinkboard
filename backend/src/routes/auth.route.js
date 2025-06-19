import express from 'express';
import { signup, login, logout, checkAuth, verifyEmail } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();


router.get("/check-auth", verifyToken, checkAuth);
router.post("/verify-email", verifyEmail);
router.post("/signup", signup); 
router.post("/login", login);
router.post("/logout", logout);



export default router;