import crypto from 'crypto';
import { create } from "ipfs-http-client";
import fs from 'fs';

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


const encryptFile = (inputFilePath, outputFilePath, secretKey) => {
    const key = crypto.scryptSync(secretKey, 'salt', 32);  // Derive key
    const iv = crypto.randomBytes(16);  // Generate a random IV

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const input = fs.createReadStream(inputFilePath);
    const output = fs.createWriteStream(outputFilePath);

    output.write(iv);  // Prepend IV for decryption
    input.pipe(cipher).pipe(output);

    return new Promise((resolve, reject) => {
        output.on('finish', () => resolve(outputFilePath));
        output.on('error', reject);
    });
};


// Upload function to IPFS
const uploadToIPFS = async (filePath) => {
    const file = fs.readFileSync(filePath);
    const { cid } = await ipfs.add(file);
    console.log('Uploaded to IPFS:', cid.toString());
    return cid.toString();
};
// 3. Store the IPFS CID in MongoDB


//Decrypt the ZIP File

const decryptFile = (encryptedFilePath, outputFilePath, secretKey) => {
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const input = fs.createReadStream(encryptedFilePath);
    const output = fs.createWriteStream(outputFilePath);

    let iv = Buffer.alloc(16);
    input.read(16, 0, 16, (err, bytesRead, buffer) => {
        if (err) throw err;
        iv = buffer;
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        input.pipe(decipher).pipe(output);
    });

    return new Promise((resolve, reject) => {
        output.on('finish', () => resolve(outputFilePath));
        output.on('error', reject);
    });
};

export default { encryptFile, uploadToIPFS, decryptFile };
// Example usage
// decryptFile('model_encrypted.zip', 'model_decrypted.zip', secretKey)
//     .then(() => console.log('File decrypted successfully'))
//     .catch(err => console.error('Decryption error:', err));

// Final Workflow

//     Encrypt the ZIP file before uploading.
//     Upload encrypted file to IPFS and get CID.
//     Store CID in MongoDB with the request.
//     Once accepted, backend downloads the encrypted file from IPFS, decrypts it, and generates the Docker image.

// Next Steps

//     Do you want me to modify your existing backend code to integrate this encryption & IPFS upload?
//     Would you like asymmetric encryption (RSA) instead of AES for additional security?

