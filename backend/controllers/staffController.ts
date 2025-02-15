import { Request, Response } from "express";
import { StaffModel } from "../models/StaffModel";

const staffModel = new StaffModel();

export const getAllStaff = (req: Request, res: Response): Response => {
  const staff = staffModel.getAllStaff();
  return res.status(200).json(staff);
};

export const getStaffById = (req: Request, res: Response): Response => {
  const { staffPassId } = req.params;
  const staff = staffModel.getStaffById(staffPassId);
  if (!staff) {
    return res.status(404).json({ error: "Staff ID not found" });
  }
  return res.status(200).json(staff);
};

export const searchStaffByTeam = (req: Request, res: Response): Response => {
  const { teamName } = req.params;
  const staff = staffModel.searchStaffByTeam(teamName);
  if (staff.length === 0) {
    return res.status(404).json({ error: "No staff found for this team" });
  }
  return res.status(200).json(staff);
};
