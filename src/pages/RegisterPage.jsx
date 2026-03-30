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
      <div className="container auth-container">
        <div className="page-header" style={{ marginBottom: "2rem" }}>
          <h1>Create Account</h1>
          <p>Start tracking your productivity today.</p>
        </div>

        <div className="card-modern p-4">
          <form onSubmit={handleSubmit}>
            {displayError && <div className="alert-error">{displayError}</div>}

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

            <div className="mb-3">
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

            <div className="mb-4">
              <label className="form-label">
                <FiLock size={14} />
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
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-accent w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ padding: "0.875rem", fontSize: "1rem" }}
            >
              <FiUserPlus size={18} />
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-4 text-muted" style={{ fontSize: "0.9rem" }}>
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
