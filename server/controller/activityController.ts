import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { ActivityLog } from "../model/ActivityLog.js";

// Get all activity
// GET /api/activity
export const getActivity = async(req:AuthRequest,res:Response):Promise<void>=>{
    try{
        const activity = await ActivityLog.find({user:req.user._id}).sort({createdAt:-1}).limit(10);
        res.json(activity);
    }
    catch(error:any){
    console.error("GET ACTIVITY ERROR:", error);

    res.status(500).json({
        message: error?.message || "Server error"
    });
}
}