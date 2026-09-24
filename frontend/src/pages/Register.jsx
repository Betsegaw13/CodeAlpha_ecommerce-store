import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { registerUser } from "../api/auth";
import {
  setAuthToken,
} from "../api/authStorage";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
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

    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      /*
       * Some backends return a token immediately after
       * registration. If yours does, we can log the user
       * in automatically.
       */
      if (data?.token) {
        setAuthToken(data.token);
        window.dispatchEvent(
          new Event("nova-auth-change"),
        );
        navigate("/", {
          replace: true,
        });

        return;
      }

      /*
       * Otherwise, send the new user to login.
       */
      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to create your account.",
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
              Join NOVA
            </p>

            <h1>
              Your everyday
              <br />
              <em>starts here.</em>
            </h1>

            <p>
              Create an account to keep your cart,
              manage orders, and enjoy a smoother
              shopping experience.
            </p>
          </div>

          <span className="auth-panel-note">
            One account. One simple shopping experience.
          </span>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-header">
            <p className="section-kicker">Account</p>

            <h2>Create account</h2>

            <p>
              Set up your NOVA account in a few seconds.
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
                placeholder="Choose a username"
                autoComplete="username"
                required
              />
            </label>

            <label>
              <span>Email</span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
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
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
            </label>

            <label>
              <span>Confirm password</span>

              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
              />
            </label>

            <button
              type="submit"
              className="button button-dark auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <div className="auth-switch">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
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

export default Register;