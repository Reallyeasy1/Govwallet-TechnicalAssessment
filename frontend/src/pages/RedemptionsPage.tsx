import React, { useEffect, useState } from "react";
import { fetchAllRedemptions, addRedemption } from "../api/redemptionApi";
import "./RedemptionsPage.css";

interface Redemption {
  teamName: string;
  redeemedAt?: string | null;
}

export function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [teamName, setTeamName] = useState("");
  const [addMessage, setAddMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadRedemptions = async () => {
    try {
      const data = await fetchAllRedemptions();
      const formattedData = data.map(({ teamName, redeemedAt }) => ({
        teamName: teamName.toUpperCase(),
        redeemedAt: redeemedAt ? new Date(parseInt(redeemedAt)).toLocaleString() : "Not Redeemed",
      }));
      console.log(formattedData);
      setRedemptions(formattedData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddRedemption = async () => {
    if (!teamName.trim()) {
      setAddMessage("Please enter a team name.");
      return;
    }
    setLoading(true);
    try {
      const result = await addRedemption(teamName);
      setAddMessage(result.message);
      loadRedemptions();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRedemptions();
  }, []);

  return (
    <div className="redemption-page">
      <div className="add-redemption">
        <input type="text" value={teamName} placeholder="Enter team name" onChange={(e) => setTeamName(e.target.value)} className="search-input" />
        <button onClick={handleAddRedemption} disabled={loading} className="redeem-button">
          {loading ? "Processing..." : "Add Redemption"}
        </button>
        {addMessage && <p className="add-message">{addMessage}</p>}
      </div>

      {error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <table className="redemption-table">
          <thead>
            <tr>
              <th className="table-header">Team Name</th>
              <th className="table-header">Redeemed At</th>
            </tr>
          </thead>
          <tbody>
            {redemptions.length > 0 ? (
              redemptions.map(({ teamName, redeemedAt }, index) => (
                <tr key={index} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                  <td className="table-cell">{teamName}</td>
                  <td className="table-cell">{redeemedAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="no-data">
                  No redemptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
