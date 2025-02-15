import express from "express";
import cors from "cors";
import apiRoutes from "../routes/apiRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api", apiRoutes);

export default app;
