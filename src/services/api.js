const API_BASE = "/api";

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server not reachable. Make sure to run 'vercel dev' instead of 'npm run dev'.");
  }

  if (!res.ok) {
    const error = new Error(data.error || "Request failed");
    error.status = res.status;
    throw error;
  }

  return data;
}
