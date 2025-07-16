import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/User.routes";
import ContentRouter from "./routes/Content.routes";
import TagRouter from "./routes/Tag.routes";
import LinkRouter from "./routes/Link.routes";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());
// app.use("/static", express.static("public"));

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/content", ContentRouter);
app.use("/api/v1/tag", TagRouter);
app.use("/api/v1/public", LinkRouter);

export default app;
