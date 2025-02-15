import fs from "fs";
import path from "path";
import { TeamNameNotFound } from "../errors/teamNameNotFound";

interface RedemptionData {
  teamName: string;
  redeemedAt: string;
}

export class RedemptionModel {
  private static instance: RedemptionModel;
  private redemptionData: RedemptionData[] = [];

  private constructor() {}

  public static getInstance(): RedemptionModel {
    if (!RedemptionModel.instance) {
      RedemptionModel.instance = new RedemptionModel();
      RedemptionModel.instance.loadRedemptionData();
    }
    return RedemptionModel.instance;
  }

  private loadRedemptionData(): void {
    const filePath = path.resolve(__dirname, "../data/redemption-data.csv");

    if (!fs.existsSync(filePath)) {
      console.warn("Redemption CSV file not found. Initializing an empty redemption dataset.");
      return;
    }

    try {
      const csvData = fs.readFileSync(filePath, "utf-8").split("\n");
      const headers = csvData.shift()?.split(",") || [];
      const teamIndex = headers.indexOf("teamName");
      const dateIndex = headers.indexOf("redeemedAt");

      if (teamIndex === -1 || dateIndex === -1) {
        console.error("Redemption CSV file is missing required headers.");
        return;
      }

      this.redemptionData = csvData
        .map((line) => line.split(","))
        .filter((row) => row.length > 1)
        .map((row) => ({
          teamName: row[teamIndex].trim(),
          redeemedAt: row[dateIndex].trim(),
        }));

      console.log(`Loaded ${this.redemptionData.length} redemption records from CSV.`);
    } catch (error) {
      console.error("Error loading redemption data from CSV:", error);
    }
  }

  public validateTeamName(teamName: string): void {
    const teamExists = this.redemptionData.some((record) => record.teamName.toLowerCase() === teamName.toLowerCase());
    if (!teamExists) {
      throw new TeamNameNotFound();
    }
  }

  public hasTeamRedeemed(teamName: string): boolean {
    const normalizedTeamName = teamName.trim().toLowerCase();
    return this.redemptionData.some((record) => record.teamName.toLowerCase() === normalizedTeamName);
  }

  public getAllRedemptionData(): RedemptionData[] {
    return this.redemptionData;
  }
}
