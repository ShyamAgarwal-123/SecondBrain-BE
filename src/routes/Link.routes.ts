import { Router } from "express";
import { Auth } from "../middlewares/Auth.middlewares";
import { getBrain, share } from "../controllers/Link.controllers";

const LinkRouter = Router();

LinkRouter.route("/share").post(Auth, share);
LinkRouter.route("/:shareLink").get(getBrain);

export default LinkRouter;
