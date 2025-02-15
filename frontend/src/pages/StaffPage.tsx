import React, { useEffect, useState } from "react";
import { fetchAllStaff, Staff } from "../api/staffApi";
import { StaffList } from "../components/StaffList";
import "./StaffPage.css";
import { addRedemption } from "../api/redemptionApi";

const ITEMS_PER_PAGE = 30;

export function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [staffPassId, setStaffPassId] = useState("");
  const [redemptionMessage, setRedemptionMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await fetchAllStaff();
        setStaffList(data);
        setFilteredStaff(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    loadStaff();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = staffList.filter((staff) => staff.staffPassId.toLowerCase().includes(term));
    setFilteredStaff(results);
    setCurrentPage(1);
  };

  const handleTeamRedemption = async () => {
    if (!staffPassId.trim()) return;
    try {
      const teamName = staffList.filter((staff) => staff.staffPassId.toLowerCase().includes(staffPassId.toLowerCase()));
      if (teamName.length == 0) {
        setRedemptionMessage("Team not found for the provided Staff Pass ID.");
        return;
      }
      if (teamName.length > 1) {
        setRedemptionMessage("Multiple Staff Pass IDs found.");
        return;
      }
      const result = await addRedemption(teamName[0].teamName);
      setRedemptionMessage(`Team ${teamName[0].teamName} redeemed: ${result.message}`);
    } catch (err) {
      setRedemptionMessage((err as Error).message);
    }
  };

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="staff-page">
      <h1>Staff Directory</h1>
      <input type="text" placeholder="Search by Staff Pass ID" value={searchTerm} onChange={handleSearch} className="search-input" />
      <div className="redemption-input">
        <input
          type="text"
          placeholder="Enter Staff Pass ID to redeem"
          value={staffPassId}
          onChange={(e) => setStaffPassId(e.target.value)}
          className="search-input"
        />
        <button onClick={handleTeamRedemption} className="redeem-button">
          Redeem
        </button>
      </div>
      {redemptionMessage && <p className="redemption-message">{redemptionMessage}</p>}
      {error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <>
          <StaffList staffList={paginatedStaff} />
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
