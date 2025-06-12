import fs from "fs";
import path from "path";
import os from "os";
import { exec as execCallback, spawn } from "child_process";
import { promisify } from "util";
import generateDockerfile from "../services/trainingService.js";
import Task from "../models/taskModel.js";
import Status from "../models/statusModel.js";

const exec = promisify(execCallback);

const dockerUsername = process.env.DOCKER_USERNAME;
const dockerPassword = process.env.DOCKER_PASSWORD;
const imageName = "decenaix-secure-image";

const generateDockerImage = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).send("Task not found");

    const status = await Status.findOne({ taskId });
    if (!status) return res.status(404).send("Status not found");

    const zipCid = task.ipfsCID;
    const password = task.filePassword;

    const dockerfileContent = generateDockerfile(zipCid, password);

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `docker-${taskId}-`));
    const dockerfilePath = path.join(tempDir, "Dockerfile");
    fs.writeFileSync(dockerfilePath, dockerfileContent);
    console.log(`Dockerfile created at ${dockerfilePath}`);

    // Check if Docker is available
    try {
      await exec("docker --version");
    } catch {
      return res.status(500).send("Docker is not installed or not running");
    }

    await exec(`docker build -t ${imageName} -f ${dockerfilePath} ${tempDir}`);
    console.log("Docker image built successfully");

    // Docker login
    await new Promise((resolve, reject) => {
      const dockerLogin = spawn("docker", [
        "login",
        "-u",
        dockerUsername,
        "--password-stdin",
      ]);
      dockerLogin.stdin.write(dockerPassword);
      dockerLogin.stdin.end();

      dockerLogin.on("close", (code) => {
        if (code !== 0) return reject(new Error("Docker login failed"));
        resolve();
      });
    });
    console.log("Logged into Docker Hub");

    const imageTag = `${dockerUsername}/${imageName}:${taskId}`;
    await exec(`docker tag ${imageName} ${imageTag}`);
    await exec(`docker push ${imageTag}`);
    console.log("Docker image pushed successfully");

    status.status = "WORKING";
    await status.save();

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });

    return res.status(200).send({
      message: "Docker image built and pushed successfully",
      imageUrl: `https://hub.docker.com/r/${dockerUsername}/${imageName}/tags`,
      tag: taskId,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export default {
  generateDockerImage
};
