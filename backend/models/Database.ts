import fs from "fs";
import path from "path";
import { RedemptionModel } from "./RedemptionModel";

interface StaffData {
  staffPassId: string;
  teamName: string;
}

export class Database {
  private static instance: Database;
  private staffData: StaffData[] = [];
  private redemptionModel: RedemptionModel;

  private constructor() {
    this.loadStaffData();
    this.initializeRedemptionData();
    this.redemptionModel = RedemptionModel.getInstance(path.resolve(__dirname, "../data/redemption-data.csv"));
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private loadStaffData(): void {
    const filePath = path.resolve(__dirname, "../data/staff-id-to-team-mapping-long.csv");

    if (!fs.existsSync(filePath)) {
      console.error("CSV file not found at path:", filePath);
      return;
    }

    try {
      const csvData = fs.readFileSync(filePath, "utf-8").split("\n");
      const headers = csvData.shift()?.split(",") || [];
      const idIndex = headers.indexOf("staff_pass_id");
      const teamIndex = headers.indexOf("team_name");

      if (idIndex === -1 || teamIndex === -1) {
        console.error("CSV file missing required headers.");
        return;
      }

      this.staffData = csvData
        .map((line) => line.split(","))
        .filter((row) => row.length > 1)
        .map((row) => ({
          staffPassId: row[idIndex].trim(),
          teamName: row[teamIndex].trim(),
        }));

      console.log(`Loaded ${this.staffData.length} staff records from CSV.`);
    } catch (error) {
      console.error("Error loading staff data from CSV:", error);
    }
  }

  private initializeRedemptionData(): void {
    const redemptionFilePath = path.resolve(__dirname, "../data/redemption-data.csv");

    if (fs.existsSync(redemptionFilePath)) {
      console.log("Redemption data file already exists.");
      return;
    }

    try {
      const uniqueTeams = Array.from(new Set(this.staffData.map((staff) => staff.teamName)));

      const csvHeader = "teamName,redeemedAt\n";
      const csvContent = uniqueTeams.map((team) => `${team},\n`).join("");

      fs.writeFileSync(redemptionFilePath, csvHeader + csvContent);
      console.log(`Created redemption-data.csv with ${uniqueTeams.length} unique teams.`);
    } catch (error) {
      console.error("Error creating redemption-data.csv:", error);
    }
  }

  public getRedemptionModel(): RedemptionModel {
    return this.redemptionModel;
  }

  public getTeamByStaffId(staffPassId: string): string | undefined {
    const normalizedId = staffPassId.trim().toLowerCase();
    const staff = this.staffData.find((s) => s.staffPassId.toLowerCase() === normalizedId);
    return staff?.teamName;
  }

  public getAllStaffData(): StaffData[] {
    return this.staffData;
  }
}
