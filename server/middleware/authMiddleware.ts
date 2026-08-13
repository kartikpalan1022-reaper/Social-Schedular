import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { User } from "../model/User.js";

export interface AuthRequest extends Request{
    user?: any;
}

export const protect = async(req:AuthRequest,res:Response,next:NextFunction)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded : any = jwt.verify(token,process.env.JWT_SECRET!);
            // req.user = await User.findById(decoded.id).select("-password");
            // next()
            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({
                    message: "User not found",
                });
            }
            req.user = user;
            next();
        }
        catch(error : any){
            res.status(401).json({message:error?.message || "Not authorized, token failed"});          
        }
    }
    else{
        res.status(401).json({message:"Not authorized, no token"});
    }
}

export const cronAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!process.env.CRON_SECRET) {
        return res.status(500).json({message: "CRON_SECRET is not configured"});
    }

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({message: "Unauthorized"});
    }
    next();
};