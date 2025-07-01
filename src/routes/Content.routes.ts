import { Router } from "express";
import { uploadContent } from "../controllers/Content.controllers";
import { Auth } from "../middlewares/Auth.middlewares";

const ContentRouter = Router();

ContentRouter.route("/create").post(Auth, uploadContent);

export default ContentRouter;
