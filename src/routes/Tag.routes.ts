import { Router } from "express";
import { createTag } from "../controllers/Tag.controllers";
import { Auth } from "../middlewares/Auth.middlewares";

const TagRouter = Router();

TagRouter.route("/create").post(Auth, createTag);

export default TagRouter;
