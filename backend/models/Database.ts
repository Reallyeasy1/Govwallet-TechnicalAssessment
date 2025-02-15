import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";

interface StaffData {
  staffPassId: string;
  teamName: string;
}

export class Database {
  private static instance: Database;
  private staffData: StaffData[] = [];

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.loadStaffData();
    }
    return Database.instance;
  }

  private loadStaffData(): void {
    const filePath = path.join(__dirname, "../data/staff-id-to-team-mapping-long.xlsx");

    if (!fs.existsSync(filePath)) {
      console.error("Excel file not found at path:", filePath);
      return;
    }

    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[] = xlsx.utils.sheet_to_json(sheet);
      this.staffData = jsonData.map((row) => ({
        staffPassId: String(row["staff_pass_id"]),
        teamName: String(row["team_name"]),
      }));

      console.log(`Loaded ${this.staffData.length} staff records from Excel.`);
    } catch (error) {
      console.error("Error loading staff data from Excel:", error);
    }
  }

  public getAllStaffData(): StaffData[] {
    return this.staffData;
  }
}
