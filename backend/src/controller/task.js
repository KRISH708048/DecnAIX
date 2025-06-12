import fs from "fs";
import Task from "../models/taskModel.js";
import Machine from "../models/Machine.js";
import User from "../models/userModel.js";
import Status from "../models/statusModel.js";
import zod from "zod";
import pinataService from "../services/pinataServices.js";

const { fileUploadToIPFS, deleteFromPinata } = pinataService;

const TASK_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

const isZipFile = (filePath) => {
  try {
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    return (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    );
  } catch (error) {
    console.error("Error checking ZIP file:", error);
    return false;
  }
};

const createTaskSchema = zod.object({
  name: zod.string().min(1),
  duration: zod.string().regex(/^\d+$/).transform(Number),
  password: zod.string().min(8),
});

// file upload to ipfs
const uploadModel = async (req, res) => {
  let zipFilePath = req.file?.path;
  let ipfsHash = null;

  try {
    const { password } = req.body;
    const zipFile = req.file;
    if (!zipFile) {
      return res.status(400).json({ error: "Zip file missing!" });
    }

    zipFilePath = zipFile.path;

    if (!isZipFile(zipFilePath)) {
      return res.status(400).json({ error: "Invalid ZIP archive" });
    }
    ipfsHash = await fileUploadToIPFS(zipFilePath, password);
    return res.status(200).json({
      cid: ipfsHash,
    });
  } catch (err) {
    console.error("Task creation error:", err);
    if (ipfsHash) {
      await deleteFromPinata(ipfsHash);
    }
    return res.status(500).json({
      error: "Task creation failed",
      details: err.message,
    });
  } finally {
    if (zipFilePath && fs.existsSync(zipFilePath)) {
      fs.unlinkSync(zipFilePath);
    }
  }
};

// task creation 
const createTask = async (req, res) => {
  let ipfsHash = null;

  try {
    const { name, duration, password, ipfsCID, onChainAccepted, taskNumber } =
      req.body;
    const validation = createTaskSchema.safeParse({ name, duration, password });
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validation.error.errors,
      });
    }
    ipfsHash = ipfsCID;
    console.log(onChainAccepted);
    const onChain = onChainAccepted === "true";
    if (!onChain) {
      await deleteFromPinata(ipfsCID);
      return res.status(201).json({
        message: "On-chain Declined!",
      });
    }

    const newTask = await Task.create({
      userId: req.userId,
      name: name,
      ipfsCID: ipfsCID,
      duration: duration,
      filePassword: password,
      taskNumber: taskNumber,
      status: "PENDING",
    });
    console.log(newTask);
    return res.status(201).json({
      message: "Task created successfully",
      taskId: newTask._id,
      name: name,
      cid: ipfsCID,
      duration: newTask.duration,
      taskNumber: newTask.taskNumber,
    });
  } catch (err) {
    console.error("Task creation error:", err);
    if (ipfsHash) {
      await deleteFromPinata(ipfsHash);
    }
    return res.status(500).json({
      error: "Task creation failed",
      details: err.message,
    });
  }
};

// make machine request
const createRequest = async (req, res) => {
  try {
    const { name, machineId, machineOwnerId } = req.body;
    if (!name || !machineId || !machineOwnerId) {
      return res.status(400).json({
        message: "All fields (name, machineId, machineOwnerId) are required!",
      });
    }

    const task = await Task.findOne({userId: req.userId, name: name});
    const check = await Status.find({taskId: task._id });
    
    if (check.length>0) {
      if (check.status == "WORKING" || check.status == "COMPLETED")
        return res.status(404).json({ message: "In Process" });
      else if (check.status == "FAILED") {
        await deleteFromPinata(task.ipfsHash);
        await Task.deleteOne({ _id: task._id });
        return res.status(200).json({ message: "failed recreated-task" });
      }
      return res
        .status(200)
        .json({ message: "Already Requested!", response: false });
    }
    const machine = await Machine.findById(machineId);
    const machineOwner = await User.findById(machineOwnerId);
    if (!task || !machine || !machineOwner) {
      return res.status(404).json({
        message: "Task, Machine, or Machine Owner not found!",
        taskFound: !!task,
        machineFound: !!machine,
        ownerFound: !!machineOwner,
      });
    }

    if (!machine.available) {
      return res.status(404).json({
        message: "Request another Machine, due to non-availability!",
        taskFound: !!task,
        machineFound: !!machine,
        ownerFound: !!machineOwner,
      });
    }

    const newStatus = await Status.create({
      taskId: task._id,
      machineId,
      machineOwnerId,
      status: "PENDING",
    });

    return res
      .status(200)
      .json({ message: "Request sent successfully!", response: true });
  } catch (err) {
    console.error("Error in createRequest:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

// get all request a user have for its machines
const allRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const requests = await Status.find({ machineOwnerId: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "taskId",
        select: "name userId duration taskNumber status", 
        populate: {
          path: "userId",
          select: "name  wallet_address", 
        },
      })
      .populate({
        path: "machineId",
        select: "name userId _id", 
        populate: {
          path: "userId",
          select: "name", 
        },
      });

    const formatRequest = (req) => ({
      taskId: req.taskId?._id || "N/A",
      taskName: req.taskId?.name || "N/A",
      status: req.status,
      duration: req.taskId?.duration || "N/A",
      taskNumber: req.taskId?.taskNumber || "N/A",
      walletAddress: req.taskId?.userId?.wallet_address || "N/A",
      machineName: req.machineId?.name || "N/A",
      machineId: req.machineId?._id || "N/A",
    });

    const underProcessing = requests
      .filter((req) => req.status === "PENDING")
      .map(formatRequest);

    const processed = requests
      .filter((req) => req.status !== "PENDING")
      .map(formatRequest);

    return res.status(200).json({
      processed,
      underProcessing,
      counts: {
        total: requests.length,
        processed: processed.length,
        underProcessing: underProcessing.length,
      },
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({ error: "Error fetching requests" });
  }
};

// machine grant by owner
const requestApproval = async (req, res) => {
  try {
    const { approvalStatus, taskName, machineId } = req.body;
    const userId = req.userId;
    const approvals = approvalStatus.toUpperCase();

    if (!approvalStatus || !taskName || !machineId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const machine = await Machine.findOne({ _id: machineId, userId: userId });
    if (!machine) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this request" });
    }

    const task = await Task.findOne({ name: taskName });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const request = await Status.findOne({
      taskId: task._id,
      machineOwnerId: userId,
      machineId: machineId,
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (approvals === TASK_STATUS.REJECTED) {
      await Status.deleteOne({ _id: request._id });
      return res.status(200).json({
        message: "Request rejected successfully",
        response: false,
      });
    }

    if (approvals !== TASK_STATUS.ACCEPTED) {
      return res.status(400).json({ error: "Invalid approval status" });
    }

    request.status = "WORKING";
    await request.save();

    machine.available = false;
    await machine.save();

    return res.status(200).json({
      message: "Request accepted successfully",
      response: true,
    });
  } catch (error) {
    console.error("Error updating request:", error);
    return res.status(500).json({ error: "Error updating request" });
  }
};

// to know ongoing status of task
const getStatusForTask = async (req, res) => {
  try {
    const { taskName } = req.params;
    const userId = req.userId;
    const task = await Task.findOne({ name: taskName, userId: userId });
    if (!task) {
      return res.status(404).json({ error: "Task not found for this user" });
    }

    const statusRecord = await Status.findOne({ taskId: task._id });
    if (!statusRecord) {
      return res.status(202).json({ status: "REJECTED" });
    }

    return res.status(200).json({ status: statusRecord.status });
  } catch (error) {
    console.error("Error fetching status for task:", error);
    return res.status(500).json({ error: "Error fetching status" });
  }
};

// get all the task created by user
const allTask = async (req, res) => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ userId: userId }).sort({ createdAt: -1 });

    const taskIds = tasks.map((task) => task._id);

    const statuses = await Status.find({ taskId: { $in: taskIds } })
      .sort({ createdAt: -1 })
      .populate({
        path: "taskId",
        select: "name userId duration taskNumber status",
        populate: {
          path: "userId",
          select: "name walletAddress",
        },
      })
      .populate({
        path: "machineId",
        select: "name userId _id",
        populate: {
          path: "userId",
          select: "name",
        },
      });

    const formatted = statuses.map((req) => ({
      taskId: req.taskId?._id || "N/A",
      taskName: req.taskId?.name || "N/A",
      userId: req.taskId?.userId?._id || "N/A",
      walletAddress: req.taskId?.userId?.walletAddress || "N/A",
      duration: req.taskId?.duration || "N/A",
      status: req.status || "PENDING",
      machineId: req.machineId?._id || "N/A",
      machineName: req.machineId?.name || "N/A",
      machineOwnerId: req.machineId?.userId?._id || "N/A",
      machineOwnerName: req.machineId?.userId?.name || "N/A",
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching tasks with status:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  uploadModel,
  createTask,
  createRequest,
  allRequests,
  requestApproval,
  getStatusForTask,
  allTask
};
