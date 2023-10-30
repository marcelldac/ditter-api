import express from "express";
import cors from "express";

const PORT = process.env.PORT || 4000;

const HOSTNAME = process.env.HOSTNAME || "http://localhost";

const app = express();

app.get("/", (req, res) => {
  res.send("chupa cu");
});

app.use(cors());

app.use((req, res) => {
  res.status(404);
});

app.listen(PORT, () => {
  console.log(`Running on ${HOSTNAME}:${PORT} `);
});
