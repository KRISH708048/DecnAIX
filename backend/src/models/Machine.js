import mongoose from "mongoose";
const { Schema } = mongoose;

const machineSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {type: String, enum: ['HIGH', 'MID', 'BASIC', 'LOW'], default: 'BASIC'},
    cpu: { type: String, required: true },
    ram: { type: String, required: true },
    size: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Machine = mongoose.model('Machine', machineSchema);

export default Machine;