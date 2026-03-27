import { useState } from "react";
import { Link } from "react-router";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
    } catch {
      // error is set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="page-header" style={{ marginBottom: "2rem" }}>
          <h1>Welcome Back</h1>
          <p>Log in to continue your focus sessions.</p>
        </div>

        <div className="card-modern p-4">
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  background: "var(--danger-subtle)",
                  color: "var(--danger)",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <div className="mb-3">
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                <FiMail size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-modern"
                style={{ width: "100%" }}
              />
            </div>

            <div className="mb-4">
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                <FiLock size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                minLength={8}
                className="input-modern"
                style={{ width: "100%" }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-accent w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ padding: "0.875rem", fontSize: "1rem", opacity: submitting ? 0.7 : 1 }}
            >
              <FiLogIn size={18} />
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p
            className="text-center mt-4"
            style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
          >
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
