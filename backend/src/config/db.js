import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const password = process.env.MONGO_PASSWORD;

mongoose.connect(`mongodb+srv://Krish:${password}@decnaix.1c615.mongodb.net/decenAIX?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});
