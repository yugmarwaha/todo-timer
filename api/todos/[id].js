import pool from "../_db.js";
import { verifyRequest } from "../_auth.js";

export default async function handler(req, res) {
  const auth = verifyRequest(req);
  if (!auth) return res.status(401).json({ error: "Unauthorized" });

  const { userId } = auth;
  const { id } = req.query;

  if (req.method === "PUT") {
    const { text, completed } = req.body || {};
    const sets = [];
    const values = [];
    let idx = 1;

    if (text !== undefined) {
      sets.push(`text = $${idx++}`);
      values.push(text.trim());
    }
    if (completed !== undefined) {
      sets.push(`completed = $${idx++}`);
      values.push(completed);
    }

    if (sets.length === 0) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    values.push(id, userId);

    try {
      const result = await pool.query(
        `UPDATE todos SET ${sets.join(", ")} WHERE id = $${idx++} AND user_id = $${idx}
         RETURNING id, text, completed, created_at AS "createdAt", total_time_seconds AS "totalTimeSeconds"`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Todo not found" });
      }

      return res.status(200).json({ todo: result.rows[0] });
    } catch (err) {
      console.error("Update todo error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const result = await pool.query(
        "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id",
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Todo not found" });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Delete todo error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
