import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: false, unique: true },
    ipfsCID: { type: String, required: true },
    filePassword : { type: String, required: true },
    duration: { type: Number, required: false },
    taskNumber: {type: String, required: true},
    status: {
      type: String,
      enum: ["PENDING","REJECTED", "ACCEPTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);

export default Task;
