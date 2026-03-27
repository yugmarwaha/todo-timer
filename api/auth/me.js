import pool from "../_db.js";
import { verifyRequest } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = verifyRequest(req);
  if (!auth) {
    return res.status(200).json({ user: null });
  }

  try {
    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [auth.userId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error("Auth check error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
