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
    <div className="page-wrapper fade-in d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="container auth-container">
        <div className="page-header" style={{ marginBottom: "2rem" }}>
          <h1>Welcome Back</h1>
          <p>Log in to continue your focus sessions.</p>
        </div>

        <div className="card-modern p-4">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert-error">{error}</div>}

            <div className="mb-3">
              <label className="form-label">
                <FiMail size={14} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-modern"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                <FiLock size={14} />
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
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-accent w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ padding: "0.875rem", fontSize: "1rem" }}
            >
              <FiLogIn size={18} />
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center mt-4 text-muted" style={{ fontSize: "0.9rem" }}>
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
