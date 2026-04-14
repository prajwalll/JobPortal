import express from "express";
import dotenv from "dotenv";
import userRouts from "./routes/user.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/user", userRouts);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
