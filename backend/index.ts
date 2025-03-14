import express, { json } from "express";
import { blogRoutes } from "./src/routes/BlogRoutes";

const app = express();
const port = 3000;

app.use(json());

app.use("/blogs", blogRoutes);

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
