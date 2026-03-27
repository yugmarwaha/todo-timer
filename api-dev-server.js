/**
 * Local development server for API routes.
 * Emulates Vercel serverless functions locally.
 * Run with: node api-dev-server.js
 */
import http from "http";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
dotenv.config({ path: resolve(__dirname, ".env.local") });

const PORT = 3001;

// Map URL paths to handler files
const routes = {
  "POST /api/auth/register": "./api/auth/register.js",
  "POST /api/auth/login": "./api/auth/login.js",
  "POST /api/auth/logout": "./api/auth/logout.js",
  "GET /api/auth/me": "./api/auth/me.js",
  "GET /api/todos": "./api/todos/index.js",
  "POST /api/todos": "./api/todos/index.js",
  "PUT /api/todos/": "./api/todos/[id].js",
  "DELETE /api/todos/": "./api/todos/[id].js",
  "GET /api/sessions": "./api/sessions/index.js",
  "GET /api/streaks": "./api/streaks/index.js",
  "POST /api/timer/complete": "./api/timer/complete.js",
  "GET /api/active-task": "./api/active-task.js",
  "PUT /api/active-task": "./api/active-task.js",
};

async function findHandler(method, url) {
  const path = url.split("?")[0];

  // Exact match first
  const exactKey = `${method} ${path}`;
  if (routes[exactKey]) {
    const mod = await import(routes[exactKey]);
    return { handler: mod.default, query: {} };
  }

  // Dynamic route: /api/todos/:id
  const todosMatch = path.match(/^\/api\/todos\/(\d+)$/);
  if (todosMatch && (method === "PUT" || method === "DELETE")) {
    const mod = await import("./api/todos/[id].js");
    return { handler: mod.default, query: { id: todosMatch[1] } };
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  // Parse body for POST/PUT
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    try {
      req.body = body ? JSON.parse(body) : {};
    } catch {
      req.body = {};
    }
    req.query = req.query || {};

    const result = await findHandler(req.method, req.url);
    if (!result) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    req.query = { ...req.query, ...result.query };

    // Mock res.json and res.status for Vercel-style handlers
    let statusCode = 200;
    const originalEnd = res.end.bind(res);

    res.status = (code) => {
      statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      originalEnd(JSON.stringify(data));
    };

    try {
      await result.handler(req, res);
    } catch (err) {
      console.error("Handler error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      originalEnd(JSON.stringify({ error: "Internal server error" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`API dev server running on http://localhost:${PORT}`);
});
