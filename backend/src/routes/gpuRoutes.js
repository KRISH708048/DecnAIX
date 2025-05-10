import express from 'express';
import machineController from "../controller/machines.js";
import authenticate from "../middlewares/authMiddleware.js"

const router = express.Router();

const { createMachine, getAllMachines, getMachinesByUserId } = machineController;

router.post('/machines/create', authenticate, createMachine);
router.get('/machines/all', authenticate, getAllMachines);
router.get('/machines/userMachine', authenticate, getMachinesByUserId);

export default router;