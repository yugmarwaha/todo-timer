import pool from "../_db.js";
import { verifyRequest } from "../_auth.js";

export default async function handler(req, res) {
  const auth = verifyRequest(req);
  if (!auth) return res.status(401).json({ error: "Unauthorized" });

  const { userId } = auth;

  if (req.method === "GET") {
    try {
      const result = await pool.query(
        `SELECT t.id, t.text, t.completed, t.created_at AS "createdAt", t.total_time_seconds AS "totalTimeSeconds",
         COALESCE(json_agg(
           json_build_object('id', s.id, 'text', s.text, 'completed', s.completed, 'createdAt', s.created_at)
           ORDER BY s.created_at
         ) FILTER (WHERE s.id IS NOT NULL), '[]') AS subtasks
         FROM todos t
         LEFT JOIN subtasks s ON s.todo_id = t.id
         WHERE t.user_id = $1
         GROUP BY t.id
         ORDER BY t.created_at ASC`,
        [userId]
      );
      return res.status(200).json({ todos: result.rows });
    } catch (err) {
      console.error("Get todos error:", err);
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
        `INSERT INTO todos (user_id, text) VALUES ($1, $2)
         RETURNING id, text, completed, created_at AS "createdAt", total_time_seconds AS "totalTimeSeconds"`,
        [userId, text.trim()]
      );
      return res.status(201).json({ todo: { ...result.rows[0], subtasks: [] } });
    } catch (err) {
      console.error("Create todo error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
