import { Router } from "express";
import {
  deleteContent,
  getAllContents,
  uploadContent,
} from "../controllers/Content.controllers";
import { Auth } from "../middlewares/Auth.middlewares";

const ContentRouter = Router();

ContentRouter.use(Auth);

ContentRouter.route("/create").post(uploadContent);
ContentRouter.route("/getAll").get(getAllContents);
ContentRouter.route("/delete/:contentId").delete(deleteContent);

export default ContentRouter;
