import { useState } from "react";
import { Link } from "react-router";
import { FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
    } catch {
      // error is set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="page-wrapper fade-in d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="page-header" style={{ marginBottom: "2rem" }}>
          <h1>Create Account</h1>
          <p>Start tracking your productivity today.</p>
        </div>

        <div className="card-modern p-4">
          <form onSubmit={handleSubmit}>
            {displayError && (
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
                {displayError}
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
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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
              <FiUserPlus size={18} />
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p
            className="text-center mt-4"
            style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
