import express from 'express';
import machineController from "../services/gpuService.js";

const { createMachine, getAllMachines, getMachinesByUserId } = machineController;

const router = express.Router();

// Create a machine
router.post('/machines/create', createMachine);

// Get all machines
router.get('/machines/all', getAllMachines);

// Get machines by user ID
router.get('/machines/:userID', getMachinesByUserId);

export default router;