import { Router } from "express";
import userRouter from './src/routes/userRouter';
import chatRouter from './src/routes/chatRouter';

const router = Router();

router.use('/user', userRouter);
router.use('/chat', chatRouter)

export default router;