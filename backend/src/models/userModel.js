import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    role: { type: String, enum: ['DEVELOPER', 'GPU_CONTRIBUTOR'], default: 'UNIVERSAL' },
    hashedPassword: { type: String, required: true },
    passwordSalt: { type: String },
    wallet_address: { type: String, required: true },
  },
  { timestamps: true }
);

const User =  mongoose.model('User', userSchema);
export default User;