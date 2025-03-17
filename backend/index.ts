import express, { json } from "express";
var cors = require("cors");

import { blogRoutes } from "./src/routes/blogRoutes";

const app = express();
const port = 3000;

app.use(json());

app.use(
  cors({
    origin: "http://localhost:5173", // Only allow requests from this domain
  })
);

app.use("/posts", blogRoutes);

app.get("/", (req, res) => {
  res.send("working fine!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error!" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
