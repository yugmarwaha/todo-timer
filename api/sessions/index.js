import pool from "../_db.js";
import { verifyRequest } from "../_auth.js";

export default async function handler(req, res) {
  const auth = verifyRequest(req);
  if (!auth) return res.status(401).json({ error: "Unauthorized" });

  const { userId } = auth;

  if (req.method === "GET") {
    try {
      const result = await pool.query(
        `SELECT id, todo_id AS "taskId", duration_seconds AS "durationSeconds",
                completed_at AS "completedAt", date
         FROM sessions WHERE user_id = $1 ORDER BY completed_at DESC`,
        [userId]
      );
      return res.status(200).json({ sessions: result.rows });
    } catch (err) {
      console.error("Get sessions error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
