// import fs from "fs";
// // import { exec as execCallback, spawn } from "child_process";
// // import { promisify } from "util";
// import generateDockerfile from "../services/trainingService.js";
// // import Request from "../models/Request.js";

// const exec = promisify(execCallback);

// const dockerUsername = process.env.DOCKER_USERNAME;
// const dockerPassword = process.env.DOCKER_PASSWORD;
// const imageName = "hemil-secure-image";

// export const generateDockerImage = async (req, res) => {
//   try {
//     const { requestId } = req.body;
//     const request = await Request.findById(requestId);

//     if (!request) return res.status(404).send("Request not found");

//     const datasetCid = request.datasetLink;
//     const modelScriptCid = request.modelLink;
//     const requirementsCid = request.requirementsLink;

//     const dockerfileContent = generateDockerfile(
//       datasetCid,
//       modelScriptCid,
//       requirementsCid
//     );
//     fs.writeFileSync("Dockerfile", dockerfileContent);
//     console.log("Dockerfile created successfully");

//     // Build Docker image
//     await exec(`docker build -t ${imageName} .`);
//     console.log("Docker image built successfully");

//     // Docker login using spawn
//     await new Promise((resolve, reject) => {
//       const dockerLogin = spawn("docker", [
//         "login",
//         "-u",
//         dockerUsername,
//         "--password-stdin",
//       ]);
//       dockerLogin.stdin.write(dockerPassword);
//       dockerLogin.stdin.end();

//       dockerLogin.on("close", (code) => {
//         if (code !== 0) return reject(new Error("Docker login failed"));
//         resolve();
//       });
//     });

//     console.log("Logged into Docker Hub successfully");

//     const imageTag = `${dockerUsername}/${imageName}:latest`;

//     // Tag and push image
//     await exec(`docker tag ${imageName} ${imageTag}`);
//     await exec(`docker push ${imageTag}`);
//     console.log("Docker image pushed successfully");

//     request.status = "completed";
//     await request.save();

//     return res.status(200).send({
//       message: "Docker image built and pushed successfully",
//       imageUrl: `https://hub.docker.com/r/${dockerUsername}/${imageName}`,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send("Internal Server Error");
//   }
// };
