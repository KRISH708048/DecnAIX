import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const password = process.env.MONGO_PASSWORD;

mongoose.connect(`mongodb+srv://krishagarwal7080:${password}@cluster0.lehtyug.mongodb.net/decenAI`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});
