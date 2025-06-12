import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true }, 
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true }, 
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    blockchainHash: { type: String, required: true, unique: true }, 
    amount: { type: Number, required: true }, 
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, 
    network: { type: String, enum: ['Ethereum', 'Binance Smart Chain', 'Polygon', 'Solana', 'Other'], required: true }, 
    contractAddress: { type: String }, 
    gasUsed: { type: Number }, 
    timestamp: { type: Date, default: Date.now }, 
    transactionDetails: { type: Schema.Types.Mixed },
  },
  { timestamps: true } 
);

transactionSchema.index({ transactionId: 1, blockchainHash: 1 }, { unique: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;