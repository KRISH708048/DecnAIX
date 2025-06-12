import express from 'express';
import machineController from "../controller/machines.js";
import { authorizedRenter } from '../middlewares/authorization.js';
import { authorizedProvider } from '../middlewares/authorization.js';
import trainController from "../controller/train.js";

const { generateDockerImage } = trainController;
const router = express.Router();

const { createMachine, getAllMachines, getMachinesByUserId } = machineController;

// for renter
router.get('/machines/all', authorizedRenter,getAllMachines);

// for provider
router.post('/machines/create', authorizedProvider, createMachine);
router.get('/machines/userMachine', authorizedProvider, getMachinesByUserId);
router.get('/getDockerImage', authorizedProvider, generateDockerImage);

export default router;