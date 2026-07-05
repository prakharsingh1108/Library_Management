import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { connectDB } from './database/db.js';
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from './routes/authRouter.js';
import bookRouter from './routes/bookRoutes.js';
import borrowRouter from './routes/borrowRoutes.js';
import userRouter from './routes/userRouter.js';

export const app = express();

config({ path: './config/config.env' });

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/borrow', borrowRouter);
app.use('/api/v1/users', userRouter);

connectDB();

app.use(errorMiddleware);