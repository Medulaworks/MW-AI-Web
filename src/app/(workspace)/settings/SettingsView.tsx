"use client";

import { useState } from "react";
import { Pill } from "@/components/Pill";
import type { Org, BU } from "@/lib/types";

export function SettingsView({ orgs, businessUnits }: { orgs: Org[]; businessUnits: BU[] }) {
  const [tab, setTab] = useState<"profile" | "units" | "taxonomy" | "jurisdictions" | "notifications" | "audit">("profile");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Settings</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Tenant configuration for taxonomy, jurisdictions, workflows and notifications.
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button className={`btn btn-sm ${tab === "profile" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("profile")}>Organisation profile</button>
        <button className={`btn btn-sm ${tab === "units" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("units")}>Business units</button>
        <button className={`btn btn-sm ${tab === "taxonomy" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("taxonomy")}>Taxonomy</button>
        <button className={`btn btn-sm ${tab === "jurisdictions" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("jurisdictions")}>Jurisdictions</button>
        <button className={`btn btn-sm ${tab === "notifications" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("notifications")}>Notifications</button>
        <button className={`btn btn-sm ${tab === "audit" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("audit")}>Audit activity</button>
      </div>

      {tab === "profile" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <section className="praig-card" style={{ padding: 18 }}>
            <h3 className="section-title">Active organisation</h3>
            <Field label="Name"><input className="input" defaultValue="Apex Bank Plc" /></Field>
            <Field label="Industry"><input className="input" defaultValue="Financial Services" /></Field>
            <Field label="Region"><input className="input" defaultValue="UK / EU" /></Field>
            <Field label="Synthetic demo">
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" defaultChecked />
                <span style={{ fontSize: 13 }}>Mark workspace as synthetic demonstration</span>
              </label>
            </Field>
          </section>

          <section className="praig-card" style={{ padding: 18 }}>
            <h3 className="section-title">All synthetic organisations</h3>
            <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>Switch between demo tenants to inspect different data sets.</p>
            <div style={{ marginTop: 10 }}>
              {orgs.map((o) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 10, borderBottom: "1px solid #F1F5F9" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{o.name}</div>
                    <div style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{o.industry} · {o.region}</div>
                  </div>
                  <Pill status={o.id === "ORG-APX" ? "Active" : "Available"} variant={o.id === "ORG-APX" ? "mint" : "slate"} />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "units" && (
        <section className="praig-card" style={{ padding: 18 }}>
          <h3 className="section-title">Business units</h3>
          <table className="praig-table" style={{ marginTop: 10 }}>
            <thead><tr><th>ID</th><th>Name</th><th>Organisation</th></tr></thead>
            <tbody>
              {businessUnits.map((b) => {
                const org = orgs.find((o) => o.id === b.orgId);
                return (
                  <tr key={b.id}>
                    <td className="mono">{b.id}</td>
                    <td style={{ fontWeight: 600 }}>{b.name}</td>
                    <td>{org?.name ?? b.orgId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {tab === "taxonomy" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <section className="praig-card" style={{ padding: 18 }}>
            <h3 className="section-title">Classification levels</h3>
            <div style={{ marginTop: 10 }}>
              {["Public", "Internal", "Confidential", "Restricted", "Highly Sensitive"].map((c) => (
                <div key={c} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: 13 }}>{c}</span>
                  <Pill status={c.includes("Sensitive") || c === "Restricted" ? "High" : c === "Confidential" ? "Medium" : "Low"} variant={c.includes("Sensitive") || c === "Restricted" ? "coral" : c === "Confidential" ? "amber" : "mint"} />
                </div>
              ))}
            </div>
          </section>
          <section className="praig-card" style={{ padding: 18 }}>
            <h3 className="section-title">Asset categories</h3>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Database", "File share", "Cloud bucket", "SaaS", "Data warehouse", "CRM", "Document repository", "Endpoint", "AI knowledge base", "Backup", "API"].map((c) => (
                <span key={c} className="tag">{c}</span>
              ))}
            </div>
          </section>
          <section className="praig-card" style={{ padding: 18 }}>
            <h3 className="section-title">Risk-rating method</h3>
            <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 6 }}>Inherent and residual risks are scored on Likelihood × Impact.</p>
            <Field label="Scale">Low / Medium / High / Critical</Field>
            <Field label="Method">Configurable per jurisdiction</Field>
            <Field label="Default accept"><input className="input" defaultValue="Medium residual with approval" /></Field>
          </section>
        </div>
      )}

      {tab === "jurisdictions" && (
        <section className="praig-card" style={{ padding: 18 }}>
          <h3 className="section-title">Jurisdiction settings</h3>
          <table className="praig-table" style={{ marginTop: 10 }}>
            <thead><tr><th>Jurisdiction</th><th>Frameworks</th><th>Lawful basis options</th><th>Request deadline</th></tr></thead>
            <tbody>
              <tr>
                <td>UK</td>
                <td>UK GDPR, DPA 2018, AML</td>
                <td>Consent, Contract, Legal obligation, Legitimate interests</td>
                <td>30 days</td>
              </tr>
              <tr>
                <td>EU</td>
                <td>GDPR, EU AI Act</td>
                <td>Consent, Contract, Legal obligation, Legitimate interests</td>
                <td>30 days</td>
              </tr>
              <tr>
                <td>US</td>
                <td>HIPAA, CCPA, FDA 21 CFR Part 11</td>
                <td>Consent, Authorization, Treatment, Payment, Operations</td>
                <td>45 days</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {tab === "notifications" && (
        <section className="praig-card" style={{ padding: 18 }}>
          <h3 className="section-title">Notification preferences</h3>
          <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 6 }}>Synthetic configuration for the prototype.</p>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Asset review overdue", on: true },
              { label: "Vendor review overdue", on: true },
              { label: "Egress event blocked", on: true },
              { label: "Egress event pending review", on: true },
              { label: "High-risk assessment submitted", on: false },
              { label: "Privacy request approaching deadline", on: true },
              { label: "Exception expiring this week", on: true },
              { label: "AI system approval requested", on: false },
            ].map((p) => (
              <label key={p.label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
                <input type="checkbox" defaultChecked={p.on} />
                <span style={{ fontSize: 13 }}>{p.label}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      {tab === "audit" && (
        <section className="praig-card" style={{ padding: 18 }}>
          <h3 className="section-title">Audit activity</h3>
          <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 6 }}>Recent configuration changes. In a static prototype these are simulated.</p>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { actor: "Admin", action: "Updated notification preferences", at: "2026-01-08 11:30" },
              { actor: "Admin", action: "Activated synthetic demo label", at: "2026-01-05 09:15" },
              { actor: "Privacy Office", action: "Updated UK jurisdiction settings", at: "2025-12-22 16:00" },
            ].map((a, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ fontSize: 13 }}>{a.action}</div>
                <div style={{ fontSize: 11, color: "var(--mw-text-muted)" }} className="mono">{a.at} · {a.actor}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
      <div style={{ fontSize: 11, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 13, marginTop: 4 }}>{children}</div>
    </div>
  );
}