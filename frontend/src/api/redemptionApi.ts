export interface RedemptionStatus {
  teamName: string;
  canRedeem: boolean;
  message: string;
}

export const fetchRedemptionStatus = async (teamName: string): Promise<RedemptionStatus> => {
  const response = await fetch(`http://localhost:3000/api/redemption/${teamName}/can-redeem`);
  if (!response.ok) {
    throw new Error(`Failed to fetch redemption status: ${response.statusText}`);
  }
  return response.json();
};

export const fetchAllRedemptions = async (): Promise<RedemptionStatus[]> => {
  const response = await fetch(`http://localhost:3000/api/redemption`);
  if (!response.ok) {
    throw new Error(`Failed to fetch all redemptions: ${response.statusText}`);
  }
  return response.json();
};
