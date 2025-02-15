import { StaffModel } from "../models/StaffModel";
import { Database } from "../models/Database";

describe("StaffModel Tests", () => {
  let staffModel: StaffModel;

  beforeAll(() => {
    Database.getInstance();
    staffModel = new StaffModel();
  });

  test("Should retrieve all staff records", () => {
    const allStaff = staffModel.getAllStaff();
    expect(allStaff.length).toBeGreaterThan(0);
  });

  test("Should retrieve staff by ID", () => {
    const sampleStaff = staffModel.getAllStaff()[0];
    const staff = staffModel.getStaffById(sampleStaff.staffPassId);
    expect(staff).toBeDefined();
    expect(staff?.staffPassId).toBe(sampleStaff.staffPassId);
  });

  test("Should search staff by team", () => {
    const sampleStaff = staffModel.getAllStaff()[0];
    const teamName = sampleStaff.teamName;
    const staffList = staffModel.searchStaffByTeam(teamName);
    expect(staffList.length).toBeGreaterThan(0);
    expect(staffList[0].teamName).toBe(teamName);
  });

  test("Should return undefined for invalid staff ID", () => {
    const staff = staffModel.getStaffById("INVALID_ID");
    expect(staff).toBeUndefined();
  });

  test("Should return empty array for unknown team", () => {
    const staffList = staffModel.searchStaffByTeam("UnknownTeam");
    expect(staffList).toEqual([]);
  });
});
