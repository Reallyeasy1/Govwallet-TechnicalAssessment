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
});
