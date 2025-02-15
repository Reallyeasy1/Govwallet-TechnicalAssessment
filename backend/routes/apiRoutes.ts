import express from "express";
import staffRoutes from "./staffRoutes";
import redemptionRoutes from "./redemptionRoutes";

const router = express.Router();

router.use("/staff", staffRoutes);
router.use("/redemption", redemptionRoutes);

router.get("/", (_req, res) => {
  res.send("Welcome to GovWallet API");
});

export default router;
