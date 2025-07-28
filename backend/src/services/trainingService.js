export default function generateDockerfile(zipCid, zipPassword) {
  return `
  FROM python:3.9-slim

  # Install necessary tools
  RUN apt-get update && apt-get install -y \\
      unzip wget gnupg openssl && \\
      rm -rf /var/lib/apt/lists/*

  WORKDIR /app

  # Download the encrypted zip from IPFS
  RUN wget https://ipfs.io/ipfs/${zipCid} -O encrypted.zip.enc

  # Set build-time environment variable ARG ZIP_PASSWORD ENV ZIP_PASSWORD=${zipPassword}

  # Decrypt the zip file
  RUN openssl enc -aes-256-cbc -d -in encrypted.zip.enc -out decrypted.zip -pass pass:${zipPassword}

  # Extract the contents
  RUN unzip decrypted.zip -d .
  
  # Install Python dependencies
  RUN pip install --no-cache-dir -r requirements.txt
  COPY ..
  # Ensure the output directory exists (will be mounted later)
  VOLUME ["/data_base"]

  # Run training script
  CMD python main.py && \\
      mv output_weight.pkl /data_base/output_weight.pkl && \\
      echo "Training complete. Output stored at /data_base/output_weight.pkl"
  `;
}
