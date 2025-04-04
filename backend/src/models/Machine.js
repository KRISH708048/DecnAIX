import mongoose from "mongoose";
const { Schema } = mongoose;

const machineSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, unique: true },
    category: {type: String, enum: ['HIGH', 'MID', 'BASIC'], default: 'BASIC'},
    cpu: { type: String, required: true },
    ram: { type: String, required: true },
    storage: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const Machine = mongoose.model('Machine', machineSchema);

export default Machine;