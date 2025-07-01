import app from "./app";
import dbConnect from "./db";

import { config } from "dotenv";

config({
  path: "./.env",
});

dbConnect()
  .then(() => {
    app.on("error", (error: any) => {
      console.log("App Error: ", error);
      process.exit(1);
    });
    app.listen(process.env.PORT as string, () => {
      console.log(`App is listening at Port: ${process.env.PORT}`);
    });
  })
  .catch((err: any) => {
    console.log(`Database connection failed:  ${err}`);
  });
