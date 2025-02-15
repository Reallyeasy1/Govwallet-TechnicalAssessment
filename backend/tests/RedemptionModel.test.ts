import { RedemptionData, RedemptionModel } from "../models/RedemptionModel";
import fs from "fs";
import path from "path";

describe("RedemptionModel (CSV Reader) Tests", () => {
  let redemptionModel: RedemptionModel;
  let originalData: any;
  const testFilePath = path.resolve(__dirname, "../data/redemption-data-test.csv");

  beforeAll(() => {
    // Create a new RedemptionModel instance with test file path
    redemptionModel = RedemptionModel.getInstance(testFilePath);

    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, "teamName,redeemedAt\n");
    }

    originalData = [...redemptionModel.getAllRedemptionData()];
  });

  afterEach(() => {
    redemptionModel["redemptionData"] = [...originalData];
  });

  afterAll(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  test("Should load all redemption records from CSV", () => {
    const redemptionData = redemptionModel.getAllRedemptionData();
    expect(redemptionData.length).toBeGreaterThan(0);
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
    const result = redemptionModel.addRedemption("GRYFFINDOR");
    expect(result).toBe("Redemption recorded.");
    expect(redemptionModel.hasTeamRedeemed("GRYFFINDOR")).toBe(true);
  });
});
