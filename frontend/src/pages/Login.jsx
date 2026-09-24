import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { loginUser } from "../api/auth";
import { setAuthToken } from "../api/authStorage";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser(form);

      if (!data?.token) {
        throw new Error(
          "Login succeeded, but no authentication token was returned.",
        );
      }

      setAuthToken(data.token);
      window.dispatchEvent(
  new Event("nova-auth-change"),
);

      const destination =
        location.state?.from || "/";

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to sign in. Please check your details.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-brand-panel">
          <Link to="/" className="auth-brand">
            <span className="brand-mark">N</span>
            <span>NOVA</span>
          </Link>

          <div className="auth-brand-content">
            <p className="section-kicker">
              Welcome back
            </p>

            <h1>
              Good products.
              <br />
              <em>Simple experience.</em>
            </h1>

            <p>
              Sign in to manage your account, save your
              cart, and continue where you left off.
            </p>
          </div>

          <span className="auth-panel-note">
            Thoughtfully selected. Everyday essentials.
          </span>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-header">
            <p className="section-kicker">Account</p>

            <h2>Sign in</h2>

            <p>
              Enter your details to continue to NOVA.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div
                className="auth-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <label>
              <span>Username</span>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </label>

            <label>
              <span>Password</span>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            <button
              type="submit"
              className="button button-dark auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          <div className="auth-switch">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create one
            </Link>
          </div>

          <Link to="/" className="auth-back-home">
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Login;