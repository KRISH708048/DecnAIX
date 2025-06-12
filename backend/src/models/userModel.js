import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    role: { type: String, enum: ['Tenant', 'Provider', 'Both'], default: 'Both', required: true },
    hashedPassword: { type: String, required: true },
    wallet_address: { type: String, required: true },
  },
  { timestamps: true }
);

const User =  mongoose.model('User', userSchema);
export default User;