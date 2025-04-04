// controller/task.js
import fs from 'fs';
import path from 'path';
import pinata from '../config/pinata.js';
import Task from '../models/taskModel.js';

const isZipFile = (filePath) => {
    try {
        const buffer = Buffer.alloc(4);
        const fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 4, 0);
        fs.closeSync(fd);
        return buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;
    } catch (error) {
        console.error("Error checking ZIP file:", error);
        return false;
    }
};

const fileUploadToIPFS = async (req, res) => {
    try {
        const password = req.body.password;
        const zipFile = req.file;

        if (!zipFile || !password) {
            return res.status(400).json({ error: 'Zip file and password are required' });
        }

        const zipFilePath = zipFile.path;

        // Check if valid ZIP
        if (!isZipFile(zipFilePath)) {
            fs.unlinkSync(zipFilePath);
            return res.status(400).json({ error: 'Uploaded file is not a valid ZIP archive' });
        }

        // Create readable stream
        const readableStream = fs.createReadStream(zipFilePath);
        
        // Set up Pinata options
        const options = {
            pinataMetadata: {
                name: `model-${Date.now()}.zip`,
                keyvalues: {
                    encrypted: 'true',
                    modelType: 'machineLearning'
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };

        // Upload to IPFS
        const result = await pinata.pinFileToIPFS(readableStream, options);
        
        // Store task in database
        await Task.create({
            userId: req.userId,
            name: "ML Model Upload",
            ipfsCID: result.IpfsHash,
            duration: 3,
            status: "PENDING",
        });

        // Clean up temp file
        fs.unlinkSync(zipFilePath);

        return res.status(201).json({
            message: "File uploaded to IPFS",
            note: "Ensure you remember the password to decrypt the file!",
            cid: result.IpfsHash
        });

    } catch (err) {
        console.error("Upload error:", err);
        
        // Clean up temp file if exists
        if (req.file?.path) {
            fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).json({ 
            error: 'Error uploading file to IPFS',
            details: err.message
        });
    }
};

export default fileUploadToIPFS;