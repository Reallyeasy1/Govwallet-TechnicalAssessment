import React, { useEffect, useState } from "react";
import { fetchAllRedemptions, addRedemption } from "../api/redemptionApi";

interface Redemption {
  teamName: string;
  redeemedAt?: string | null;
}

export const RedemptionsPage: React.FC = () => {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [addMessage, setAddMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadRedemptions = async () => {
    try {
      const data = await fetchAllRedemptions();
      const formattedData = data.map((item: Redemption) => ({
        ...item,
        redeemedAt: item.redeemedAt ? new Date(parseInt(item.redeemedAt)).toISOString() : null,
      }));
      setRedemptions(formattedData);
      setError(null);
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
    setAddMessage(null);

    try {
      const result = await addRedemption(teamName);
      const newRedemption: Redemption = {
        teamName,
        redeemedAt: new Date(Date.now()).toISOString(),
      };
      setRedemptions((prev) => [newRedemption, ...prev]);
      setAddMessage(result.message);
    } catch (err) {
      setAddMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRedemptions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Redemptions</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Add Redemption</h2>
        <input
          type="text"
          value={teamName}
          placeholder="Enter team name"
          onChange={(e) => setTeamName(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleAddRedemption}
          disabled={loading}
          style={{
            padding: "8px 12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Add Redemption"}
        </button>
        {addMessage && <p style={{ color: loading ? "#555" : "#4CAF50" }}>{addMessage}</p>}
      </div>

      <h2>Redemption List</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {redemptions.length > 0 ? (
            redemptions.map((redemption, index) => (
              <li key={index} style={{ padding: "5px 0", borderBottom: "1px solid #eee" }}>
                <strong>{redemption.teamName}</strong>
                {redemption.redeemedAt && (
                  <div style={{ fontSize: "0.9em", color: "#555" }}>Redeemed At: {new Date(redemption.redeemedAt).toLocaleString()}</div>
                )}
              </li>
            ))
          ) : (
            <p>No redemptions found.</p>
          )}
        </ul>
      )}
    </div>
  );
};
