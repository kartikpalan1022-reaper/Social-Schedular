import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./route/authRoute.js";
import socialAuthRouter from "./route/socialAuthRoute.js";
import accountRouter from "./route/accountRoute.js";
import postRouter from "./route/postRoute.js";
import activityRouter from "./route/activityRoute.js";
import { initScheduler } from "./services/schedulerService.js";

const app = express();


// Database connection
await connectDB();


// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use("/api/auth",authRouter);
app.use("/api/oauth",socialAuthRouter);
app.use("/api/accounts",accountRouter);
app.use("/api/posts",postRouter);
app.use("/api/activity",activityRouter);

// Initialize Scheduler
initScheduler();

// Global Error Handler
app.use((err:any,_req:Request,res:Response,_next:NextFunction)=>{
    console.error(err);
    res.status(500).send(err?.response?.data?.message || err?.message)

})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});