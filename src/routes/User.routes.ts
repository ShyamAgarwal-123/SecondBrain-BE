import { Router } from "express";
import {
  getUser,
  refreshAccessToken,
  signin,
  signup,
} from "../controllers/User.controllers";
import { Auth } from "../middlewares/Auth.middlewares";

const UserRouter = Router();

UserRouter.route("/signup").post(signup);
UserRouter.route("/signin").post(signin);
UserRouter.route("/refreshAccessToken").get(refreshAccessToken);
UserRouter.route("/getuser").get(Auth, getUser);

export default UserRouter;
