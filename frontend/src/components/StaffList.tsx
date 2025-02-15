import React from "react";
import { Staff } from "../api/staffApi";
import { fetchAllRedemptions, fetchRedemptionStatus } from "../api/redemptionApi";
import "./StaffList.css";

interface StaffListProps {
  staffList: Staff[];
}

export function StaffList({ staffList }: StaffListProps) {
  const [redemptionStatuses, setRedemptionStatuses] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const fetchStatuses = async () => {
      const statuses: [string, string][] = [];

      try {
        const allRedemptions = await fetchAllRedemptions();

        for (const { teamName, redeemedAt } of allRedemptions) {
          if (!statuses.find(([team]) => team === teamName)) {
            statuses.push([teamName, redeemedAt ?? "Not redeemed"]);
          }
        }

        const statusRecord = Object.fromEntries(statuses);
        console.log("Status List:", statusRecord);
        setRedemptionStatuses(statusRecord);
      } catch (error) {
        console.error("Failed to fetch all redemptions:", error);
      }
    };

    fetchStatuses();
  }, [staffList]);

  return (
    <div className="staff-table-container">
      <table className="staff-table">
        <thead>
          <tr>
            <th>Staff Pass ID</th>
            <th>Team Name</th>
            <th>Redeemed At</th>
          </tr>
        </thead>
        <tbody>
          {staffList.length > 0 ? (
            staffList.map((staff) => (
              <tr key={staff.staffPassId}>
                <td>{staff.staffPassId}</td>
                <td>{staff.teamName}</td>
                <td>{redemptionStatuses[staff.teamName] == "Not Redeemed" ? "Not redeemed" : redemptionStatuses[staff.teamName]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="no-data">
                No staff records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
