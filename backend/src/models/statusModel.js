import mongoose from "mongoose";
const { Schema } = mongoose;

const statusSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true, unique: true },
    machineId: { type: Schema.Types.ObjectId, ref: "Machine", required: true },
    machineOwnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["PENDING", "WORKING", "FAILED", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);
const Status = mongoose.model("Status", statusSchema);

export default Status;
