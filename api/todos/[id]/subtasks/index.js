import pool from "../../../_db.js";
import { verifyRequest } from "../../../_auth.js";

export default async function handler(req, res) {
  const auth = verifyRequest(req);
  if (!auth) return res.status(401).json({ error: "Unauthorized" });

  const { userId } = auth;
  const todoId = req.query.id;

  if (req.method === "GET") {
    try {
      const result = await pool.query(
        `SELECT id, text, completed, created_at AS "createdAt"
         FROM subtasks WHERE todo_id = $1 AND user_id = $2 ORDER BY created_at ASC`,
        [todoId, userId]
      );
      return res.status(200).json({ subtasks: result.rows });
    } catch (err) {
      console.error("Get subtasks error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    try {
      const result = await pool.query(
        `INSERT INTO subtasks (todo_id, user_id, text) VALUES ($1, $2, $3)
         RETURNING id, text, completed, created_at AS "createdAt"`,
        [todoId, userId, text.trim()]
      );
      return res.status(201).json({ subtask: result.rows[0] });
    } catch (err) {
      console.error("Create subtask error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
