import pinata from '../config/pinata.js';
import crypto from "crypto";
import fs from "fs";

const encryptWithPassword = (inputPath, outputPath, password) => {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16);
        const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        const input = fs.createReadStream(inputPath);
        const output = fs.createWriteStream(outputPath);

        output.write(salt); // prepend salt
        output.write(iv); // prepend IV

        input.pipe(cipher).pipe(output);

        output.on('finish', () => resolve());
        output.on('error', (err) => reject(err));
    });
};

const fileUploadToIPFS = async (zipFilePath, password) => {
    let encryptedPath = `${zipFilePath}.enc`;
    let ipfsHash = null;

    try {
        await encryptWithPassword(zipFilePath, encryptedPath, password);
        const readableStream = fs.createReadStream(encryptedPath);
        
        const options = {
            pinataMetadata: {
                name: `${Date.now()}.zip`,
                keyvalues: {
                    encrypted: 'true',
                    modelType: 'machineLearning'
                }
            },
            pinataOptions: {
                cidVersion: 0
            }
        };

        const result = await pinata.pinFileToIPFS(readableStream, options);
        ipfsHash = result.IpfsHash;
        
        return ipfsHash;
    } finally {
        if (fs.existsSync(encryptedPath)) {
            fs.unlinkSync(encryptedPath);
        }
    }
};

const deleteFromPinata = async (ipfsHash) => {
    try {
        if (ipfsHash) {
            await pinata.unpin(ipfsHash);
            console.log(`Successfully deleted ${ipfsHash} from Pinata`);
        }
    } catch (err) {
        console.error("Error deleting from Pinata:", err);
    }
};

export default {
    fileUploadToIPFS,
    deleteFromPinata
}