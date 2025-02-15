import { Database } from "./Database";

interface Staff {
  staffPassId: string;
  teamName: string;
}

export class StaffModel {
  private database = Database.getInstance();

  public getStaffById(staffPassId: string): Staff | undefined {
    const staff = this.database.getAllStaffData().find((s) => s.staffPassId === staffPassId);
    if (staff) {
      return { staffPassId: staff.staffPassId, teamName: staff.teamName };
    }
    return undefined;
  }

  public getAllStaff(): Staff[] {
    return this.database.getAllStaffData().map((s) => ({
      staffPassId: s.staffPassId,
      teamName: s.teamName,
    }));
  }

  public searchStaffByTeam(teamName: string): Staff[] {
    return this.database.getAllStaffData().filter((s) => s.teamName.toLowerCase() === teamName.toLowerCase());
  }
}
