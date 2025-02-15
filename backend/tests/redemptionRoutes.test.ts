import request from "supertest";
import app from "../src/server";
import { RedemptionModel } from "../models/RedemptionModel";

//Ensure that the backend server is not running before running this test
describe("Redemption Routes Tests", () => {
  test("GET /staff/:teamName/can-redeem returns true/false with status 200", async () => {
    const sampleTeam = RedemptionModel.getInstance().getAllRedemptionData()[0]?.teamName;
    if (!sampleTeam) throw new Error("No sample team found for testing");

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
});
