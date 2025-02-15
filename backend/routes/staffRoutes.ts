import express, { Request, Response } from "express";
import { getAllStaff, getStaffById, searchStaffByTeam } from "../controllers/staffController";
import { checkTeamRedemption, getAllRedemptions } from "../controllers/redemptionController";

const router = express.Router();

router.get("/", (req: Request, res: Response): void => {
  getAllStaff(req, res);
});

router.get("/id/:staffPassId", (req: Request, res: Response): void => {
  getStaffById(req, res);
});

router.get("/team/:teamName", (req: Request, res: Response): void => {
  searchStaffByTeam(req, res);
});

export default router;
