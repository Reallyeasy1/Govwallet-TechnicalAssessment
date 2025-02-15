import fs from "fs";
import path from "path";
import { TeamNameNotFound } from "../errors/teamNameNotFound";

export class RedemptionData {
  constructor(public teamName: string, public redeemedAt: string | null = null) {}

  public hasRedeemed(): boolean {
    return this.redeemedAt !== null && this.redeemedAt.length > 0;
  }

  public static fromCsvRow(row: string[], teamIndex: number, dateIndex: number): RedemptionData {
    return new RedemptionData(row[teamIndex].trim(), row[dateIndex]?.trim() || null);
  }

  public toCsvRow(): string {
    return `${this.teamName},${this.redeemedAt ?? ""}`;
  }
}

export class RedemptionModel {
  private static instance: RedemptionModel;
  private redemptionData: RedemptionData[] = [];
  private isShutdownHookAdded = false;

  private constructor(private filePath: string) {}

  public static getInstance(filePath: string): RedemptionModel {
    if (!RedemptionModel.instance) {
      RedemptionModel.instance = new RedemptionModel(filePath);
      RedemptionModel.instance.loadRedemptionData();
      RedemptionModel.instance.setupShutdownHook();
    }
    return RedemptionModel.instance;
  }

  private loadRedemptionData(): void {
    if (!fs.existsSync(this.filePath)) {
      console.warn("Redemption CSV file not found. Initializing an empty redemption dataset.");
      return;
    }
    try {
      const csvData = fs.readFileSync(this.filePath, "utf-8").split("\n");
      const headers = csvData.shift()?.split(",") || [];
      const teamIndex = headers.indexOf("teamName");
      var dateIndex = headers.indexOf("redeemedAt");

      if (dateIndex === -1) {
        dateIndex = headers.indexOf("redeemedAt\r");
      }

      if (teamIndex === -1 || dateIndex === -1) {
        console.error("Redemption CSV file is missing required headers.");
        return;
      }

      this.redemptionData = csvData
        .map((line) => line.split(","))
        .filter((row) => row.length > 1)
        .map((row) => RedemptionData.fromCsvRow(row, teamIndex, dateIndex));

      console.log(`Loaded ${this.redemptionData.length} redemption records from CSV.`);
    } catch (error) {
      console.error("Error loading redemption data from CSV:", error);
    }
  }

  private saveRedemptionData(): void {
    const csvContent = ["teamName,redeemedAt", ...this.redemptionData.map((record) => record.toCsvRow())].join("\n");

    try {
      fs.writeFileSync(this.filePath, csvContent);
      console.log("Redemption data saved successfully.");
    } catch (error) {
      console.error("Error saving redemption data:", error);
    }
  }

  private setupShutdownHook(): void {
    if (this.isShutdownHookAdded) return;
    process.on("exit", () => this.saveRedemptionData());
    process.on("SIGINT", () => {
      this.saveRedemptionData();
      process.exit();
    });
    process.on("SIGTERM", () => {
      this.saveRedemptionData();
      process.exit();
    });
    this.isShutdownHookAdded = true;
  }

  public validateTeamName(teamName: string): void {
    const teamExists = this.redemptionData.some((record) => record.teamName.toLowerCase() === teamName.toLowerCase());
    if (!teamExists) {
      throw new TeamNameNotFound();
    }
  }

  public hasTeamRedeemed(teamName: string): boolean {
    const record = this.redemptionData.find((record) => record.teamName.toLowerCase() === teamName.toLowerCase());
    return record !== undefined && record.hasRedeemed();
  }

  public addRedemption(teamName: string): string {
    if (this.hasTeamRedeemed(teamName)) {
      return "This team has already redeemed their gift.";
    }

    const existingIndex = this.redemptionData.findIndex((record) => record.teamName.toLowerCase() === teamName.toLowerCase());

    const newRecord = new RedemptionData(teamName, Date.now().toString());
    if (existingIndex !== -1) {
      this.redemptionData[existingIndex] = newRecord;
    } else {
      this.redemptionData.push(newRecord);
    }
    this.saveRedemptionData();
    return "Redemption recorded.";
  }

  public getAllRedemptionData(): RedemptionData[] {
    return [...this.redemptionData];
  }
}
