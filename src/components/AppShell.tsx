"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navStructure = [
  { section: "Discover", items: [
    { href: "/overview", label: "Overview", icon: "M3 12l2-2 4 4 8-8 4 4" },
    { href: "/discovery", label: "Data Discovery", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { href: "/assets", label: "Asset Register", icon: "M4 7h16M4 12h16M4 17h10" },
  ]},
  { section: "Map & Govern", items: [
    { href: "/flows", label: "Data Mapping & Flows", icon: "M4 6h16M4 12h16M4 18h7" },
    { href: "/processing", label: "Processing Activities", icon: "M9 12h6M9 16h6M9 8h6M5 4h14v16H5z" },
    { href: "/ai-systems", label: "AI Systems & Models", icon: "M12 2l3 7h7l-5.5 4.5L18 22l-6-4-6 4 1.5-8.5L2 9h7z" },
    { href: "/vendors", label: "Vendors & Third Parties", icon: "M17 20h5v-2a4 4 0 00-3-3.9M9 20H4v-2a4 4 0 013-3.9m6-7a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z" },
    { href: "/assessments", label: "Risk & Impact Assessments", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ]},
  { section: "Protect", items: [
    { href: "/rights", label: "Privacy & Data Rights", icon: "M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" },
    { href: "/protection", label: "Protection & Data Egress", icon: "M12 1l9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V5l9-4z" },
  ]},
  { section: "Assure", items: [
    { href: "/controls", label: "Policies, Obligations & Controls", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { href: "/incidents", label: "Incidents & Exceptions", icon: "M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" },
    { href: "/evidence", label: "Evidence & Audit", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { href: "/reports", label: "Reports", icon: "M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2M7 13h10M5 21h14a2 2 0 002-2V7l-5-5H5a2 2 0 00-2 2v16a2 2 0 002 2z" },
    { href: "/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-2.73c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ]},
];

export function AppShell({
  children,
  orgName,
  pageTitle,
  breadcrumbs,
}: {
  children: React.ReactNode;
  orgName: string;
  pageTitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const findLabel = () => {
    for (const sec of navStructure) {
      for (const item of sec.items) {
        if (pathname === item.href || pathname.startsWith(item.href + "/")) return item.label;
      }
    }
    return "PRAIG";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? 64 : 248,
          background: "var(--mw-petrol-dark)",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          flexShrink: 0,
          transition: "width 0.18s",
          zIndex: 30,
        }}
      >
        {/* Brand */}
        <div style={{ padding: collapsed ? "14px 10px" : "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28, height: 28, borderRadius: 6,
                background: "linear-gradient(135deg, var(--mw-primary) 0%, var(--mw-accent) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 12, color: "#FFFFFF",
              }}
            >
              M
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em" }}>
                  Mangruve
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Private Intelligence
                </div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle navigation"
              style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: 4 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Product */}
        {!collapsed && (
          <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 11, color: "var(--mw-accent)", fontWeight: 700, letterSpacing: "0.08em" }}>
              PRAIG
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              Data & AI Privacy, Governance & Protection
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
          {navStructure.map((sec) => (
            <div key={sec.section}>
              {!collapsed && <div className="nav-section">{sec.section}</div>}
              {sec.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${active ? "active" : ""}`}
                    style={collapsed ? { justifyContent: "center" } : undefined}
                    title={item.label}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d={item.icon} />
                    </svg>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="status-dot dot-mint" />
              Synthetic demo environment
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid var(--mw-border)",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--mw-text-muted)" }}>
              <span style={{ fontWeight: 600 }}>PRAIG</span>
              <span>›</span>
              <span>{orgName}</span>
              {breadcrumbs?.map((b, i) => (
                <span key={i} style={{ display: "contents" }}>
                  <span>›</span>
                  <span style={{ color: i === breadcrumbs.length - 1 ? "var(--mw-text)" : undefined, fontWeight: i === breadcrumbs.length - 1 ? 600 : undefined }}>{b.label}</span>
                </span>
              ))}
              {!breadcrumbs && (
                <>
                  <span>›</span>
                  <span style={{ color: "var(--mw-text)", fontWeight: 600 }}>{pageTitle ?? findLabel()}</span>
                </>
              )}
            </div>
            {pageTitle && (
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 4 }}>
                {pageTitle}
              </h1>
            )}
          </div>

          {/* Org switcher */}
          <select className="input" style={{ width: 200, fontSize: 12 }} defaultValue="ORG-APX">
            <option value="ORG-APX">Apex Bank Plc</option>
            <option value="ORG-HPL">HealthPulse Life Sciences</option>
            <option value="ORG-OMR">OmniRetail Global</option>
          </select>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <input className="search-input" placeholder="Search assets, flows, controls..." style={{ background: "var(--mw-surface-muted)", color: "var(--mw-text)", border: "1px solid var(--mw-border)", width: 240 }} />
          </div>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            style={{ background: "transparent", border: "1px solid var(--mw-border)", borderRadius: 6, width: 32, height: 32, position: "relative", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 01-6 0" />
            </svg>
            <span style={{ position: "absolute", top: -2, right: -2, background: "var(--mw-risk-critical)", color: "#FFFFFF", borderRadius: 999, fontSize: 9, padding: "1px 5px", fontWeight: 700 }}>3</span>
          </button>

          {/* User */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 999,
                background: "var(--mw-petrol-dark)", color: "#FFFFFF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 12,
              }}
            >
              PM
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Priya Mehta</span>
              <span style={{ fontSize: 10, color: "var(--mw-text-muted)" }}>Data Protection Lead</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: "24px", maxWidth: "100%" }}>
          {children}
        </div>
      </main>
    </div>
  );
}