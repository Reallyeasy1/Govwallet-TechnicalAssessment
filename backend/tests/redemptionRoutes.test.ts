import request from "supertest";
import app from "../src/server";
import { Database } from "../models/Database";
import fs from "fs";
import path from "path";

const testFilePath = path.resolve(__dirname, "../data/redemption-data-test.csv");

describe("Redemption Routes Tests", () => {
  let redemptionModel = Database.getInstance().getRedemptionModel();

  const resetRedemptionFile = () => {
    const initialContent = `teamName,redeemedAt\nRAVENCLAW,\nSLYTHERIN,\nGryffindor,\nHUFFLEPUFF,\n`;
    fs.writeFileSync(testFilePath, initialContent);
  };

  beforeAll(() => {
    if (!fs.existsSync(testFilePath)) {
      resetRedemptionFile();
    }
  });

  afterAll(() => {
    resetRedemptionFile();
  });

  test("GET /api/redemption/:teamName/can-redeem returns true/false with status 200", async () => {
    const sampleTeam = redemptionModel.getAllRedemptionData()[0]?.teamName || "RAVENCLAW";
    const response = await request(app).get(`/api/redemption/${sampleTeam}/can-redeem`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("canRedeem");
    expect(typeof response.body.canRedeem).toBe("boolean");
  });

  test("Handles team not found with 404", async () => {
    const response = await request(app).get(`/api/redemption/NON_EXISTENT_TEAM/can-redeem`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Team name not found");
  });

  test("POST /api/redemption/:teamName/redeem adds a redemption record", async () => {
    const response = await request(app).post(`/api/redemption/RAVENCLAW/redeem`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Redemption recorded.");
    expect(redemptionModel.hasTeamRedeemed("RAVENCLAW")).toBe(true);
  });
});
