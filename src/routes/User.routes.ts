import { Router } from "express";
import { signin, signup } from "../controllers/User.controllers";

const UserRouter = Router();

UserRouter.route("/signup").post(signup);
UserRouter.route("/signin").post(signin);

export default UserRouter;
