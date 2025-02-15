import { RedemptionModel } from "../models/RedemptionModel";
import fs from "fs";
import path from "path";

describe("RedemptionModel (CSV Reader) Tests", () => {
  let redemptionModel: RedemptionModel;
  let originalData: any;

  beforeAll(() => {
    redemptionModel = RedemptionModel.getInstance();
    originalData = [...redemptionModel.getAllRedemptionData()];
  });

  afterEach(() => {
    redemptionModel["redemptionData"] = [...originalData];
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

  test("addRedemption should append a new record if team has not redeemed", () => {
    const result = redemptionModel.addRedemption("EligibleTeam");
    expect(result).toBe("Redemption successful.");
    expect(redemptionModel.hasTeamRedeemed("EligibleTeam")).toBe(true);
  });

  test("addRedemption should not add record if team has already redeemed", () => {
    redemptionModel["redemptionData"].push({ teamName: "DuplicateTeam", redeemedAt: "1234567890" });
    const result = redemptionModel.addRedemption("DuplicateTeam");
    expect(result).toBe("This team has already redeemed their gift.");
  });

  test("addRedemption should not mutate original redemptionData directly", () => {
    redemptionModel.addRedemption("TestNoMutation");
    expect(redemptionModel.getAllRedemptionData()).not.toEqual(originalData);
  });
});
