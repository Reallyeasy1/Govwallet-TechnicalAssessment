import { Database } from "../models/Database";

describe("Database (CSV Reader) Tests", () => {
  let db: Database;

  beforeAll(() => {
    db = Database.getInstance();
  });

  test("Should load all staff records from CSV", () => {
    const staffData = db.getAllStaffData();
    expect(staffData.length).toBeGreaterThan(0);
  });

  test("Should find team by staff ID", () => {
    const sampleId = db.getAllStaffData()[0]?.staffPassId;
    if (!sampleId) {
      throw new Error("No staff records loaded from CSV.");
    }
    const team = db.getTeamByStaffId(sampleId);
    expect(team).toBeDefined();
  });

  test("Should return undefined for non-existent staff ID", () => {
    const invalidStaffId = "INVALID_ID_12345";
    const team = db.getTeamByStaffId(invalidStaffId);
    expect(team).toBeUndefined();
  });

  test("Should initialize redemption-data.csv on startup", () => {
    const fs = require("fs");
    const path = require("path");
    const redemptionFilePath = path.resolve(__dirname, "../data/redemption-data.csv");
    expect(fs.existsSync(redemptionFilePath)).toBe(true);
  });

  test("Redemption data CSV should contain headers", () => {
    const fs = require("fs");
    const path = require("path");
    const redemptionFilePath = path.resolve(__dirname, "../data/redemption-data.csv");
    const csvContent = fs.readFileSync(redemptionFilePath, "utf-8");
    const headers = csvContent.split("\n")[0];
    expect(headers).toBe("teamName,redeemedAt");
  });

  test("Should return unique team names from CSV", () => {
    const teams = Array.from(new Set(db.getAllStaffData().map((staff) => staff.teamName)));
    expect(teams.length).toBeGreaterThan(0);
  });

  test("First staff record should have both staffPassId and teamName", () => {
    const firstStaff = db.getAllStaffData()[0];
    expect(firstStaff).toHaveProperty("staffPassId");
    expect(firstStaff).toHaveProperty("teamName");
  });

  test("Staff IDs should be unique", () => {
    const staffData = db.getAllStaffData();
    const uniqueIds = new Set(staffData.map((staff) => staff.staffPassId));
    expect(uniqueIds.size).toBe(staffData.length);
  });

  test("Should handle empty staff CSV gracefully", () => {
    const originalData = db.getAllStaffData();
    db["staffData"] = [];
    expect(db.getAllStaffData().length).toBe(0);
    db["staffData"] = originalData;
  });
});
