import express from 'express';
import machineController from "../controller/machines.js";
import authenticate from "../middlewares/authMiddleware.js"
// import generateDockerImage from "../controller/train.js"
const router = express.Router();

const { createMachine, getAllMachines, getMachinesByUserId } = machineController;

router.post('/machines/create', authenticate, createMachine);
router.get('/machines/all', authenticate, getAllMachines);
router.get('/machines/userMachine', authenticate, getMachinesByUserId);
// router.get('/getDockerImage', authenticate, generateDockerImage);

export default router;