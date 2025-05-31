import express from 'express';
import authenticate from '../middlewares/authMiddleware.js';
import multer from 'multer';
import taksController from '../controller/task.js';

const router = express.Router();
const secretKey = 'your-strong-secret-key';
const upload = multer({ dest: 'uploads/' });

const {uploadModel, createTask, createRequest, allRequests, requestApproval, getStatusForTask} = taksController;
router.post('/upload_Model', authenticate, upload.single('zipFile'), uploadModel);
router.post('/createTask', authenticate, createTask);
router.post('/createRequest', authenticate, createRequest);
router.get('/allRequests', authenticate, allRequests);
router.put('/requestApproval', authenticate, requestApproval);
router.get('/status/task/:taskName', authenticate, getStatusForTask);

export default router;