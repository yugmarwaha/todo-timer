import pool from "./_db.js";
import { verifyRequest } from "./_auth.js";

export default async function handler(req, res) {
  const auth = verifyRequest(req);
  if (!auth) return res.status(401).json({ error: "Unauthorized" });

  const { userId } = auth;

  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT active_todo_id FROM users WHERE id = $1",
        [userId]
      );
      return res.status(200).json({ todoId: result.rows[0]?.active_todo_id || null });
    } catch (err) {
      console.error("Get active task error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    const { todoId } = req.body || {};

    try {
      await pool.query(
        "UPDATE users SET active_todo_id = $1 WHERE id = $2",
        [todoId || null, userId]
      );
      return res.status(200).json({ todoId: todoId || null });
    } catch (err) {
      console.error("Set active task error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
