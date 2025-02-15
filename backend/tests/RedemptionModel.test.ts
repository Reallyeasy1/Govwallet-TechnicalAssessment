import { RedemptionModel } from "../models/RedemptionModel";
import fs from "fs";
import path from "path";

describe("RedemptionModel (CSV Reader) Tests", () => {
  let redemptionModel: RedemptionModel;

  beforeAll(() => {
    redemptionModel = RedemptionModel.getInstance();
  });

  test("Should load all redemption records from CSV", () => {
    const redemptionData = redemptionModel.getAllRedemptionData();
    expect(redemptionData.length).toBeGreaterThan(0);
  });

  test("Should return true for a team that has redeemed", () => {
    const sampleTeam = redemptionModel.getAllRedemptionData()[0]?.teamName;
    if (!sampleTeam) {
      throw new Error("No redemption records loaded from CSV.");
    }
    expect(redemptionModel.hasTeamRedeemed(sampleTeam)).toBe(true);
  });

  test("Should return false for a team that has not redeemed", () => {
    const nonExistentTeam = "NON_EXISTENT_TEAM";
    expect(redemptionModel.hasTeamRedeemed(nonExistentTeam)).toBe(false);
  });

  test("Should check if redemption-data.csv exists", () => {
    const filePath = path.resolve(__dirname, "../data/redemption-data.csv");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("Returns false for non-existent teams", () => {
    const nonRedeemedTeam = "NON_EXISTENT_TEAM";
    expect(redemptionModel.hasTeamRedeemed(nonRedeemedTeam)).toBe(false);
  });

  test("Should contain headers teamName and redeemedAt", () => {
    const filePath = path.resolve(__dirname, "../data/redemption-data.csv");
    const csvContent = fs.readFileSync(filePath, "utf-8");
    const headers = csvContent.split("\n")[0];
    expect(headers).toBe("teamName,redeemedAt");
  });

  test("Should handle empty redemption CSV gracefully", () => {
    const originalData = redemptionModel.getAllRedemptionData();
    redemptionModel["redemptionData"] = [];
    expect(redemptionModel.getAllRedemptionData().length).toBe(0);
    redemptionModel["redemptionData"] = originalData;
  });
});
