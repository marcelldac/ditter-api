import express from "express";

import userRoutes from "./routes/user-routes";
import loginRoutes from "./routes/login-routes";
import profileRoutes from "./routes/profile-routes";

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api", userRoutes);
app.use("/api", loginRoutes);
app.use("/api", profileRoutes);

app.listen(PORT, () => {
  console.log(`Running on ${HOSTNAME}:${PORT} `);
});
