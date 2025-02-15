import React, { useEffect, useState } from "react";
import { fetchAllRedemptions, RedemptionStatus } from "../api/redemptionApi";

export const RedemptionsPage: React.FC = () => {
  const [redemptions, setRedemptions] = useState<RedemptionStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRedemptions = async () => {
      try {
        const data = await fetchAllRedemptions();
        setRedemptions(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    loadRedemptions();
  }, []);

  return (
    <div>
      <h1>All Redemptions</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <ul>
          {redemptions.map((redemption, index) => (
            <li key={index}>
              {redemption.teamName} - {redemption.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
