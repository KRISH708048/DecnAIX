import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true }, // Unique transaction identifier
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true }, // Client initiating the transaction
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User associated with the transaction
    blockchainHash: { type: String, required: true, unique: true }, // Blockchain transaction hash
    amount: { type: Number, required: true }, // Amount involved in the transaction (could be in wei, satoshi, etc.)
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Transaction status
    network: { type: String, enum: ['Ethereum', 'Binance Smart Chain', 'Polygon', 'Solana', 'Other'], required: true }, // Blockchain network
    contractAddress: { type: String }, // Optional, if the transaction involves a smart contract
    gasUsed: { type: Number }, // Gas used for the transaction (Ethereum-based networks)
    timestamp: { type: Date, default: Date.now }, // Timestamp of the transaction
    transactionDetails: { type: Schema.Types.Mixed }, // Any additional transaction-specific details (such as contract interaction, method, etc.)
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create an index on transactionId and blockchainHash to ensure uniqueness across both fields
transactionSchema.index({ transactionId: 1, blockchainHash: 1 }, { unique: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;