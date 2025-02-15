import React, { useEffect, useState } from "react";
import { fetchAllStaff, Staff } from "../api/staffApi";
import { StaffList } from "../components/StaffList";
import "./StaffPage.css";

const ITEMS_PER_PAGE = 30;

export function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await fetchAllStaff();
        setStaffList(data);
        setFilteredStaff(data); // Show all records initially
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
    setCurrentPage(1); // Reset to first page on search
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
