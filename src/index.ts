import express from "express";
import cors from "express";

import userRouter from "./routers/users-route";

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const app = express();

app.use(cors());

app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`Running on ${HOSTNAME}:${PORT} `);
});
