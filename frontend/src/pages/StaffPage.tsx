import React, { useEffect, useState } from "react";
import { fetchAllStaff, Staff } from "../api/staffApi";
import { StaffList } from "../components/StaffList";
import "./StaffPage.css";

export function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await fetchAllStaff();
        setStaffList(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    loadStaff();
  }, []);

  return (
    <div className="staff-page">
      <h1>Staff Directory</h1>
      {error ? <p className="error-message">Error: {error}</p> : <StaffList staffList={staffList} />}
    </div>
  );
}
