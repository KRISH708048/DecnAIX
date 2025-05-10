import Machine from "../models/Machine.js";
import User from "../models/userModel.js";
import zod from "zod";

const machineType = zod.enum(["HIGH", "MID", "BASIC"]);
const machineSchema = zod.object({
  name: zod.string(),
  category: machineType.optional(),
  cpu: zod.string(),
  ram: zod.string(),
  storage: zod.string(),
  available: zod.boolean().optional(),
});

// Create a machine
const createMachine = async (req, res) => {
  try {
    let machineDetail = req.body;
    machineDetail.available = true; // default
    // { userID, title, type, cpu, ram, size, available = true }
    console.log("Creating machine:", req.body);
    const response = machineSchema.safeParse(machineDetail);
    if (!response.success) {
      return res.status(411).json({
        message: "Incorrect machine details provided",
      });
    }

    // Validate userID format (it should be a valid ObjectId)
    // if (!userID || !userID.match(/^[0-9a-fA-F]{24}$/)) {
    //     return res.status(400).json({ message: "Invalid user ID format" });
    // }
    const userId = req.userId;
    console.log(`creating machine for user with ID: ${userId}`);
    // cpu = parseInt(cpu);
    // ram = parseInt(ram);
    // size = parseInt(size);

    const newMachine = await Machine.create({
      userId: userId,
      name: machineDetail.name,
      category: machineDetail.category,
      cpu: machineDetail.cpu,
      ram: machineDetail.ram,
      storage: machineDetail.storage,
      available: machineDetail.available,
    });

    await newMachine.save();
    return res
      .status(201)
      .json({ message: "Machine created", machine: newMachine });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err?.errorResponse?.errmsg || err.message || "Unknown error",
    });
  }
};

// Get all machines grouped by type
const getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $group: {
          _id: "$category",
          machines: {
            $push: {
              _id: "$_id",
              walletAddress: "$walletAddress",
              name: "$name",
              cpu: "$cpu",
              ram: "$ram",
              storage: "$storage",
              available: "$available",
              userName: "$userDetails.name",
              userID: "$userDetails._id",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 1,
          machines: 1,
        },
      },
    ]);

    return res.status(200).json({ machines });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get machines by user ID
const getMachinesByUserId = async (req, res) => {
  try {
    const userID  = req.userId;
    // Use `findById` for efficiency
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch machines for the user
    const userMachines = await Machine.find({ userId: userID });

    return res.status(200).json({ machines: userMachines });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  createMachine,
  getAllMachines,
  getMachinesByUserId,
};
