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
      try {
        const allRedemptions = await fetchAllRedemptions();
        const statuses = allRedemptions.map(({ teamName, redeemedAt }) => ({
          teamName: teamName.toUpperCase(),
          redeemedAt: redeemedAt ? new Date(Number(redeemedAt)).toLocaleString() : "Not Redeemed",
        }));
        const statusRecord = Object.fromEntries(statuses.map(({ teamName, redeemedAt }) => [teamName, redeemedAt]));
        console.log("Formatted Redemption Statuses:", statusRecord);
        setRedemptionStatuses(statusRecord);
      } catch (error) {
        console.error("Failed to fetch redemption statuses:", error);
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
