"use client";

import { useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Wrong password");
      }

      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("next") || "/";
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="center-screen">
      <div className="card" style={{ maxWidth: 360, width: "100%" }}>
        <p className="eyebrow">deeplinker</p>
        <h1 style={{ fontSize: 20 }}>Enter password</h1>

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div className="field">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
              required
            />
          </div>

          <button className="btn btn-block" type="submit" disabled={loading}>
            {loading ? "Checking…" : "Enter"}
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
