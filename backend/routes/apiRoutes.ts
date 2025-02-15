import express from "express";
import staffRoutes from "./staffRoutes";

const router = express.Router();

router.use("/staff", staffRoutes);

// Placeholder for additional routes (e.g., redemption)
router.get("/", (_req, res) => {
  res.send("Welcome to GovWallet API");
});

export default router;
