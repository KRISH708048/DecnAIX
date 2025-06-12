import express from 'express';
import multer from 'multer';
import taksController from '../controller/task.js';
import { authorizedRenter } from '../middlewares/authorization.js';
import { authorizedProvider } from '../middlewares/authorization.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const {uploadModel, createTask, createRequest, allRequests, requestApproval, getStatusForTask, allTask} = taksController;

// for renter
router.post('/upload_Model', authorizedRenter, upload.single('zipFile'), uploadModel);
router.post('/createTask', authorizedRenter, createTask);
router.post('/createRequest', authorizedRenter, createRequest);
router.get('/status/task/:taskName', authorizedRenter, getStatusForTask);
router.get('/allTasks', authorizedRenter, allTask)

// for provider
router.get('/allRequests', authorizedProvider, allRequests);
router.put('/requestApproval',authorizedProvider, requestApproval);

export default router;