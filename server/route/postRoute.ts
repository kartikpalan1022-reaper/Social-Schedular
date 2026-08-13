import express from "express"
import { cronAuth, protect } from "../middleware/authMiddleware.js";
import { generatePost, getGenerations, getPosts, processScheduledPostsController, schedulePost } from "../controller/postController.js";
import { upload } from "../config/multer.js";

const postRouter = express.Router();

postRouter.get("/",protect,getPosts);
postRouter.get("/generations",protect,getGenerations);
postRouter.post("/",protect,upload.single("media"),schedulePost);
postRouter.post("/generate",protect,generatePost);
postRouter.post("/process-scheduled",cronAuth, processScheduledPostsController);

export default postRouter;