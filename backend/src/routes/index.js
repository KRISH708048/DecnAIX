import express from 'express';
import authRouter from "./authRoutes.js";
import providerRouter from "./gpuRoutes.js";
import taskRouter from "./taskRoutes.js";

const router = express.Router();

router.use("/user", authRouter);
router.use("/provider", providerRouter);
router.use("/task", taskRouter);

export default router;