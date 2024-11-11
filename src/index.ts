import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./dbConfigs/db";
import router from "./router/route";
import cors from "cors";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
