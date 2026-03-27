import pool from "../_db.js";
import { verifyRequest } from "../_auth.js";

export default async function handler(req, res) {
  const auth = verifyRequest(req);
  if (!auth) return res.status(401).json({ error: "Unauthorized" });

  const { userId } = auth;

  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT date, count FROM streaks WHERE user_id = $1 ORDER BY date ASC",
        [userId]
      );

      // Transform to { "YYYY-MM-DD": count } format the frontend expects
      const streaks = {};
      for (const row of result.rows) {
        const dateKey = new Date(row.date).toISOString().split("T")[0];
        streaks[dateKey] = row.count;
      }

      return res.status(200).json({ streaks });
    } catch (err) {
      console.error("Get streaks error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
