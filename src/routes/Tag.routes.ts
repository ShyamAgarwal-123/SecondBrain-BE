import { Router } from "express";
import {
  createTag,
  getAllTags,
  searchTags,
} from "../controllers/Tag.controllers";
import { Auth } from "../middlewares/Auth.middlewares";

const TagRouter = Router();
TagRouter.route("/getAll").get(getAllTags);
TagRouter.use(Auth);
TagRouter.route("/create").post(createTag);
TagRouter.route("/search").get(searchTags);

export default TagRouter;
