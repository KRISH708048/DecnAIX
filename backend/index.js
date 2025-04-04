import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rootRouter from './src/routes/index.js';
import './src/config/db.js';  // Importing a file directly

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1/", rootRouter);

app.listen(PORT, () => console.log(`running on port: ${PORT}`));
