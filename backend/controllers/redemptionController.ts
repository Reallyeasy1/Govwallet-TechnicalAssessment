import { Request, Response } from "express";
import { Database } from "../models/Database";

const redemptionModel = Database.getInstance().getRedemptionModel();

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

export const addRedemption = (req: Request, res: Response): Response => {
  const { teamName } = req.params;

  if (!teamName) {
    return res.status(400).json({
      error: "Missing team name",
      message: "The 'teamName' field is required.",
    });
  }

  try {
    redemptionModel.validateTeamName(teamName);
  } catch (error) {
    return res.status(404).json({
      error: "Team name not found",
      message: `Team name '${teamName}' does not exist in the redemption records.`,
    });
  }

  try {
    const result = redemptionModel.addRedemption(teamName);
    return res.status(200).json({ message: result });
  } catch (error) {
    return res.status(500).json({
      error: "Redemption failed",
      message: "An error occurred while processing the redemption request.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
