import { Request, Response, NextFunction } from "express";
import { RedemptionModel } from "../models/RedemptionModel";

const redemptionModel = RedemptionModel.getInstance();

export const checkTeamRedemption = (req: Request, res: Response): Response => {
  const { teamName } = req.params;

  try {
    redemptionModel.validateTeamName(teamName);
  } catch (error) {
    return res.status(404).json({
      error: "Team name not found",
      message: `Team name '${teamName}' does not exist in the redemption records.`,
    });
  }
  const hasRedeemed = redemptionModel.hasTeamRedeemed(teamName);
  return res.status(200).json({
    teamName,
    canRedeem: !hasRedeemed,
    message: hasRedeemed ? "This team has already redeemed their gift." : "This team is eligible for redemption.",
  });
};

export const getAllRedemptions = (req: Request, res: Response): Response => {
  const redemptions = redemptionModel.getAllRedemptionData();
  return res.status(200).json(redemptions);
};
