import express from "express"
import { addAccount, disconnectAccount, getAccounts } from "../controller/accountController.js";
import { protect } from "../middleware/authMiddleware.js";

const accountRouter = express.Router();

accountRouter.get("/",protect,getAccounts);
accountRouter.post("/",protect,addAccount);
accountRouter.delete("/:id",protect,disconnectAccount);

export default accountRouter;