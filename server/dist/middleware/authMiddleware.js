import jwt from "jsonwebtoken";
import { User } from "../model/User.js";
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
        catch (error) {
            res.status(401).json({ message: error?.message || "Not authorized, token failed" });
        }
    }
    else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
