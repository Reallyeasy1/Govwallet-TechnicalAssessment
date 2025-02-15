export interface Staff {
  staffPassId: string;
  teamName: string;
}

export async function fetchAllStaff(): Promise<Staff[]> {
  const response = await fetch("http://localhost:3000/api/staff");

  if (!response.ok) {
    throw new Error("Failed to fetch staff data");
  }

  return response.json();
}
