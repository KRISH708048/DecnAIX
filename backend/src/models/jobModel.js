import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        machineOwnerId: { type: String, required: true },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        gas: {
            type: Number,
            required: true,
            min: 0,
        },
        codeLink: {
            type: String,
            required: true,
            trim: true,
        },
        machineId: {
            type: String,
            ref: "Machine",
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED", "REJECTED","ACCEPTED"],
            default: "PENDING",
        },
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
