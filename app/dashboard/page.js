"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [links, setLinks] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/links");
    const data = await response.json();

    setLinks(data.links || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(event, slug) {
    event.preventDefault();
    event.stopPropagation();

    if (!confirm(`Delete "${slug}"? This can't be undone.`)) {
      return;
    }

    await fetch("/api/links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    load();
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="wrap">
      <div className="top-nav">
        <div className="brand">
          deep<span>linker</span>
        </div>

        <nav>
          <a href="/">New link</a>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              logout();
            }}
          >
            Log out
          </a>
        </nav>
      </div>

      <p className="eyebrow">Overview</p>
      <h1>Your links</h1>
      <p className="sub">Click any link below to see its full breakdown.</p>

      {!links && <p className="sub">Loading…</p>}

      {links && links.length === 0 && (
        <div className="empty">No links yet — go generate one.</div>
      )}

      {links && links.length > 0 && (
        <div className="link-list">
          {links.map((link) => (
            <a
              className="link-item"
              href={`/dashboard/${link.slug}`}
              key={link.slug}
            >
              <div style={{ minWidth: 0 }}>
                <div className="label">{link.label || `/l/${link.slug}`}</div>
                <div className="target">{link.target}</div>
              </div>

              <div className="row" style={{ gap: 10 }}>
                <span className="clicks-pill">{link.clicks} clicks</span>

                <button
                  className="btn-danger btn"
                  onClick={(event) => handleDelete(event, link.slug)}
                >
                  Delete
                </button>
              </div>
            </a>
          ))}
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}
