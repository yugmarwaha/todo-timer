import pool from "../_db.js";
import { verifyRequest } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const auth = verifyRequest(req);
  if (!auth) return res.status(401).json({ error: "Unauthorized" });

  const { userId } = auth;
  const { todoId, durationSeconds } = req.body || {};

  if (!durationSeconds || durationSeconds <= 0) {
    return res.status(400).json({ error: "durationSeconds is required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Insert session
    const sessionResult = await client.query(
      `INSERT INTO sessions (user_id, todo_id, duration_seconds, date)
       VALUES ($1, $2, $3, CURRENT_DATE)
       RETURNING id, todo_id AS "taskId", duration_seconds AS "durationSeconds",
                 completed_at AS "completedAt", date`,
      [userId, todoId || null, durationSeconds]
    );

    // 2. Upsert streak
    const streakResult = await client.query(
      `INSERT INTO streaks (user_id, date, count) VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (user_id, date) DO UPDATE SET count = streaks.count + 1
       RETURNING date, count`,
      [userId]
    );

    // 3. Update todo time if a task was linked
    let todo = null;
    if (todoId) {
      const todoResult = await client.query(
        `UPDATE todos SET total_time_seconds = total_time_seconds + $1
         WHERE id = $2 AND user_id = $3
         RETURNING id, text, completed, created_at AS "createdAt", total_time_seconds AS "totalTimeSeconds"`,
        [durationSeconds, todoId, userId]
      );
      if (todoResult.rows.length > 0) {
        todo = todoResult.rows[0];
      }
    }

    await client.query("COMMIT");

    const streak = streakResult.rows[0];
    const streakDateKey = new Date(streak.date).toISOString().split("T")[0];

    return res.status(200).json({
      session: sessionResult.rows[0],
      streak: { date: streakDateKey, count: streak.count },
      todo,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Timer complete error:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
}
