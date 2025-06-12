import express from 'express';
import authRouter from "./authRoutes.js";
import providerRouter from "./machineRoutes.js";
import taskRouter from "./taskRoutes.js";
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use("/user", authRouter);
router.use("/provider", authenticate, providerRouter);
router.use("/task", authenticate, taskRouter);

export default router;