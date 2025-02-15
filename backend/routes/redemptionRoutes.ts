import express, { Request, Response } from "express";
import { checkTeamRedemption, getAllRedemptions, addRedemption } from "../controllers/redemptionController";

const router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  getAllRedemptions(req, res);
});

router.get("/:teamName/can-redeem", (req: Request, res: Response): void => {
  checkTeamRedemption(req, res);
});

router.post("/:teamName/redeem", (req: Request, res: Response): void => {
  addRedemption(req, res);
});

export default router;
