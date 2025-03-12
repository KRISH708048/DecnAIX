import express from 'express';
import authRouter from "./authRoutes.js";
import providerRouter from "./gpuRoutes.js";
import jobRouter from "./jobRoutes.js";

const router = express.Router();


router.use("/user", authRouter);
router.use("/provider", providerRouter);
router.use("/job", jobRouter);

export default router;