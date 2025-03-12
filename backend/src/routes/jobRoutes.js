import express from 'express';
import mongoose from "mongoose";
import Task from '../models/jobModel.js';
import User from '../models/userModel.js';
import Machine from '../models/Machine.js';
import jobController from '../services/jobService.js';
const { encryptFile, uploadToIPFS, decryptFile } = jobController;
import fs from 'fs';

const router = express.Router();
const secretKey = 'your-strong-secret-key';

router.post('/taskSubmission', async (req, res) => {
    try {
        const { ownerID, machineOwnerID, amount, gas, zipFile, machineId } = req.body;

        // Validate input data
        if (!ownerID || !machineOwnerID || !amount || !gas || !zipFile || !machineId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(ownerID) || !mongoose.Types.ObjectId.isValid(machineOwnerID)) {
            return res.status(400).json({ error: 'Invalid User ID format' });
        }

        // Check if users exist
        const user = await User.findById(ownerID);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const machOwner = await User.findById(machineOwnerID);
        if (!machOwner) return res.status(404).json({ error: 'Machine Owner not found' });

        // Convert Base64 file to a real zip file
        const zipFilePath = 'uploads/model.zip';
        const encryptedFilePath = 'uploads/model_encrypted.zip';

        const buffer = Buffer.from(zipFile, 'base64');
        fs.writeFileSync(zipFilePath, buffer);

        // Encrypt the ZIP file
        await encryptFile(zipFilePath, encryptedFilePath, secretKey);
        console.log('File encrypted successfully');

        // Upload the encrypted file to IPFS
        const cid = await uploadToIPFS(encryptedFilePath);
        console.log('IPFS CID:', cid);

        // Construct the IPFS link
        const codeLink = `https://ipfs.io/ipfs/${cid}`;

        // Create and save the task in MongoDB
        const newTask = new Task({
            ownerId: ownerID,
            machineOwnerId: machineOwnerID,
            amount,
            gas,
            codeLink,
            machineId,
            status: "PENDING",
        });

        await newTask.save();
        return res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating request:', error);
        return res.status(500).json({ error: 'Error creating request' });
    }
});

router.get('/Requests/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid User ID format' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.role !== 'GPU_CONTRIBUTOR') {
            return res.status(403).json({ error: 'Not authorized to perform this task' });
        }

        // Fetch all requests related to this GPU_CONTRIBUTOR
        const requests = await Task.find({ machineOwnerId: user._id });

        // Separate requests into different categories
        const underProcess = requests.filter((x) => x.status === 'PENDING');
        const processed = requests.filter((x) => x.status !== 'PENDING'); // Includes COMPLETED & FAILED

        return res.status(200).json({ Processed: processed, UnderProcessed: underProcess });
    } catch (error) {
        console.error('Error fetching requests:', error);
        return res.status(500).json({ error: 'Error fetching requests' });
    }
});

router.put('/acceptRequest/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const { userId, response } = req.body;
        // Validate if requestId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ error: 'Invalid Request ID format' });
        }

        const request = await Task.findById(requestId);
        if (!request) return res.status(404).json({ error: 'Request not found' });

        if(response === 'REJECTED'){
            // Update the request status to REJECTED
            request.status = 'REJECTED';
            await request.save();
            return res.status(200).json({ message: 'Request rejected successfully', request });
        }

        if(response !== 'ACCEPTED'){
            return res.status(400).json({ error: 'Invalid response' });
        }

        request.status = 'ACCEPTED';
        await request.save();

        return res.status(200).json({ message: 'Request accepted successfully', request });
    } catch (error) {
        console.error('Error accepting request:', error);
        return res.status(500).json({ error: 'Error accepting request' });
    }
});

export default router;