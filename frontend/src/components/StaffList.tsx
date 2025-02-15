import React from "react";
import { Staff } from "../api/staffApi";
import "./StaffList.css";

interface StaffListProps {
  staffList: Staff[];
}

export function StaffList({ staffList }: StaffListProps) {
  return (
    <div className="staff-table-container">
      <table className="staff-table">
        <thead>
          <tr>
            <th>Staff Pass ID</th>
            <th>Team Name</th>
          </tr>
        </thead>
        <tbody>
          {staffList.length > 0 ? (
            staffList.map((staff) => (
              <tr key={staff.staffPassId}>
                <td>{staff.staffPassId}</td>
                <td>{staff.teamName}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="no-data">
                No staff records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
