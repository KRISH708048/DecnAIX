import Machine from "../models/Machine.js";
import User from "../models/userModel.js";

// Create a machine
const createMachine = async (req, res) => {
    try {
        let { userID, title, type, cpu, ram, size, available = true } = req.body;
        console.log("Creating machine:", req.body);

        // Validate userID format (it should be a valid ObjectId)
        if (!userID || !userID.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Fetch user by ID
        const user = await User.findById(userID);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        console.log("User found:", user);
        // Check if user is a GPU provider
        if (user.role !== 'GPU_CONTRIBUTOR' && user.role !== 'UNIVERSAL') {
            return res.status(403).json({ message: "User is not a GPU Provider" });
        }

        cpu = parseInt(cpu);
        ram = parseInt(ram);
        size = parseInt(size);

        if (isNaN(cpu) || isNaN(ram) || isNaN(size)) {
            return res.status(400).json({ message: "Invalid CPU, RAM, or size values" });
        }

        const newMachine = new Machine({
            userId: user._id,
            title,
            type,
            cpu,
            ram,
            size,
            available,
        });

        await newMachine.save();
        return res.status(201).json({ message: "Machine created", machine: newMachine });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
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
                    _id: "$type",
                    machines: {
                        $push: {
                            _id: "$_id",
                            title: "$title",
                            cpu: "$cpu",
                            ram: "$ram",
                            size: "$size",
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
        const { userID } = req.params;

        console.log("Fetching machines for user:", userID);

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
}