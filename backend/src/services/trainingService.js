// // function generateDockerfile(datasetCid, modelScriptCid, requirementsCid) {
// //   return `
// //   FROM python:3.9-slim
  
// //   # Install necessary tools and libraries
// //   RUN apt-get update && apt-get install -y \
// //     wget gcc libpq-dev python3-dev \
// //     && rm -rf /var/lib/apt/lists/*
  
// //   # Set the working directory
// //   WORKDIR /app
  
// //   # Download the dataset, model script, and requirements file from IPFS
// //     RUN wget https://ipfs.io/ipfs/<modelEncryptedCid> -O model.py.enc

// //   # Pass ENV var and decrypt inside container
// //   ENV DECRYPT_KEY=REPLACE_AT_RUNTIME

// //   # Decrypt encrypted script using env var
// //   RUN openssl enc -aes-256-cbc -d -in model.py.enc -out model.py -pass env:DECRYPT_KEY
  
// //   # Verify that requirements.txt is downloaded correctly
// //   RUN cat requirements.txt
  
// //   RUN pip install -r requirements.txt
// //   Run pip install Flask Flask-Cors
  
  
// //   RUN echo "from flask import Flask, jsonify" > /app/app.py && \
// //       echo "import threading" >> /app/app.py && \
// //       echo "import time" >> /app/app.py && \
// //       echo "import os" >> /app/app.py && \
// //       echo "import signal" >> /app/app.py && \
// //       echo "from flask_cors import CORS" >> /app/app.py && \
// //       echo "" >> /app/app.py && \
// //       echo "app = Flask(__name__)" >> /app/app.py && \
// //       echo "" >> /app/app.py && \
// //       echo "CORS(app)" >> /app/app.py && \
// //       echo "# A function that shuts down the Flask server after a delay" >> /app/app.py && \
// //       echo "def shutdown_server():" >> /app/app.py && \
// //       echo "    time.sleep(300)  # 5 minutes = 300 seconds" >> /app/app.py && \
// //       echo "    print('Shutting down the server after 5 minutes.')" >> /app/app.py && \
// //       echo "    os.kill(os.getpid(), signal.SIGINT)  # Send interrupt signal to stop the Flask server" >> /app/app.py && \
// //       echo "" >> /app/app.py && \
// //       echo "@app.route('/epochs', methods=['GET'])" >> /app/app.py && \
// //       echo "def get_epochs():" >> /app/app.py && \
// //       echo "    try:" >> /app/app.py && \
// //       echo "        # Load the epoch data from the file" >> /app/app.py && \
// //       echo "        with open('/app/epochs_data.json', 'r') as f:" >> /app/app.py && \
// //       echo "            data = f.read()" >> /app/app.py && \
// //       echo "        return jsonify({'epochs': data}), 200" >> /app/app.py && \
// //       echo "    except FileNotFoundError:" >> /app/app.py && \
// //       echo "        return jsonify({'error': 'Epoch data not found'}), 404" >> /app/app.py && \
// //       echo "" >> /app/app.py && \
// //       echo "if __name__ == '__main__':" >> /app/app.py && \
// //       echo "    # Start the background thread to shut down the server after 5 minutes" >> /app/app.py && \
// //       echo "    shutdown_thread = threading.Thread(target=shutdown_server)" >> /app/app.py && \
// //       echo "    shutdown_thread.daemon = True  # Ensures the thread stops when the main program exits" >> /app/app.py && \
// //       echo "    shutdown_thread.start()" >> /app/app.py && \
// //       echo "" >> /app/app.py && \
// //       echo "    app.run(host='0.0.0.0', port=5000)" >> /app/app.py
  
// //   # Start both the model training script and the Flask app
// //   CMD python model.py && python app.py
  
// //   `;
// // }


// export default function generateDockerfile(zipCid) {
//   return `
//   FROM python:3.9-slim

//   # Install necessary tools
//   RUN apt-get update && apt-get install -y \
//     unzip wget gnupg openssl && \
//     rm -rf /var/lib/apt/lists/*

//   WORKDIR /app

//   # Download the encrypted zip from IPFS
//   RUN wget https://ipfs.io/ipfs/${zipCid} -O encrypted.zip.enc

//   # Environment variable to be provided at runtime
//   ENV ZIP_PASSWORD=REPLACE_AT_RUNTIME

//   # Decrypt the zip file
//   RUN openssl enc -aes-256-cbc -d -in encrypted.zip.enc -out decrypted.zip -pass env:ZIP_PASSWORD

//   # Extract the contents
//   RUN unzip decrypted.zip -d .

//   # Install Python dependencies
//   RUN pip install --no-cache-dir -r requirement.txt

//   # Run training script
//   CMD python main.py && \
//       mv output_weight.pkl /data_base/output_weight.pkl && \
//       rm -rf /app/* && \
//       echo "Training complete. Output stored at /data_base/output_weight.pkl"
//   `;
// }


// app.post("/generatedocker", async (req, res) => {
//   const { requestId } = req.body;
//   let imageUrl = "";
//   const request = await Request.findById(requestId);
//   console.log(request);
//   const datasetCid = request.datasetLink;
//   const modelScriptCid = request.modelLink;
//   const requirementsCid = request.requirementsLink;
//   console.log(datasetCid, modelScriptCid, requirementsCid);

//   const dockerfileContent = generateDockerfile(
//     datasetCid,
//     modelScriptCid,
//     requirementsCid
//   );
//   fs.writeFileSync("Dockerfile", dockerfileContent);
//   console.log("Dockerfile created successfully");
//   // Build the Docker image
//   await exec(
//     "docker build -t hemil-docker-image .",
//     async (err, stdout, stderr) => {
//       if (err) {
//         console.error(`Error building Docker image: ${stderr}`);
//         return res.status(500).send("Failed to build Docker image");
//       }
//       console.log("Docker image built successfully");

//       console.log(stdout);

//       // Login to Docker Hub
//       const dockerLogin = spawn("docker", [
//         "login",
//         "-u",
//         dockerUsername,
//         "--password-stdin",
//       ]);
//       dockerLogin.stdin.write(dockerPassword);
//       dockerLogin.stdin.end();
//       dockerLogin.stdout.on("data", (data) => {
//         console.log(`stdout: ${data}`);
//       });
//       dockerLogin.stderr.on("data", (data) => {
//         console.error(`stderr: ${data}`);
//       });
//       dockerLogin.on("close", (code) => {
//         if (code !== 0) {
//           console.error(`docker login process exited with code ${code}`);
//           return res.status(500).send("Failed to login to Docker Hub");
//         }
//         console.log("Logged into Docker Hub successfully");
//         if (err) {
//           console.error(`Error logging into Docker Hub: ${stderr}`);
//           return res.status(500).send("Failed to login to Docker Hub");
//         }
//         console.log("Logged into Docker Hub successfully");

//         console.log(stdout);

//         // Tag the image with Docker Hub repository name
//         const imageTag = `${dockerUsername}/${imageName}:latest`;

//         // Push the Docker image to Docker Hub
//         exec(
//           `docker tag hemil-docker-image ${imageTag}`,
//           (err, stdout, stderr) => {
//             if (err) {
//               console.error(`Error tagging Docker image: ${stderr}`);
//               return res.status(500).send("Failed to tag Docker image");
//             }

//             exec(`docker push ${imageTag}`, (err, stdout, stderr) => {
//               if (err) {
//                 console.error(`Error pushing Docker image: ${stderr}`);
//                 return res.status(500).send("Failed to push Docker image");
//               }

//               console.log(stdout);
//               console.log("Docker image pushed successfully");

//               // Send back the Docker Hub image URL
//               imageUrl = `https://hub.docker.com/r/${dockerUsername}/${imageName}`;
//               res
//                 .status(200)
//                 .send({
//                   message: "Docker image built and pushed successfully",
//                   imageUrl,
//                 });
//             });
//           }
//         );
//       });
//     }
//   );
//   request.status = "completed";
//   await request.save();
// });
