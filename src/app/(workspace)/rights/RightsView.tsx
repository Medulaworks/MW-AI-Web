"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDate, statusVariant } from "@/components/Pill";
import type { PrivacyRequest, Asset, SystemRecord } from "@/lib/types";

const REQUEST_TYPES = ["Access", "Correction", "Deletion", "Restriction", "Objection", "Other"];

export function RightsView({ requests, assets, systems }: { requests: PrivacyRequest[]; assets: Asset[]; systems: SystemRecord[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(requests[0]?.id ?? null);

  const filtered = useMemo(() => requests.filter((r) => {
    if (q && !r.id.toLowerCase().includes(q.toLowerCase()) && !r.description.toLowerCase().includes(q.toLowerCase())) return false;
    if (type !== "all" && r.type !== type) return false;
    if (status !== "all" && r.status !== status) return false;
    return true;
  }), [requests, q, type, status]);

  const selected = filtered.find((r) => r.id === selectedId) ?? filtered[0];
  const selAssets = selected ? selected.relevantAssets.map((id) => assets.find((a) => a.id === id)).filter(Boolean) as Asset[] : [];
  const selSystems = selected ? selected.relevantSystems.map((id) => systems.find((s) => s.id === id)).filter(Boolean) as SystemRecord[] : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Privacy & Data Rights</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Intake, verification and response tracking for privacy rights requests. Configurable per jurisdiction.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <SummaryStat label="Open requests" value={requests.filter((r) => r.status !== "Completed").length} variant="amber" />
        <SummaryStat label="Completed" value={requests.filter((r) => r.status === "Completed").length} variant="mint" />
        <SummaryStat label="Pending verification" value={requests.filter((r) => r.verificationStatus === "Pending").length} variant="amber" />
        <SummaryStat label="Jurisdictions" value={[...new Set(requests.map((r) => r.jurisdiction))].length} variant="petrol" />
      </div>

      <section className="praig-card" style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px" }}>
            <label>Search</label>
            <input className="input" placeholder="Search requests..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <label>Type</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)} style={{ width: 160 }}>
              <option value="all">All</option>
              {REQUEST_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 160 }}>
              <option value="all">All</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Verification</option>
              <option>Scope Review</option>
            </select>
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn btn-primary btn-sm" onClick={() => alert("Synthetic prototype — request creation simulated.")}>+ Record new request</button>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "minmax(0, 1.4fr) minmax(0, 1fr)" : "1fr", gap: 16 }}>
        <section className="praig-card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="praig-table">
              <thead><tr><th>ID</th><th>Type</th><th>Description</th><th>Jurisdiction</th><th>Owner</th><th>Verification</th><th>Status</th><th>Received</th><th>Due</th></tr></thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} onClick={() => setSelectedId(r.id)} style={{ cursor: "pointer", background: r.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                    <td className="mono">{r.id}</td>
                    <td><Pill status={r.type} variant="petrol" /></td>
                    <td style={{ fontSize: 12 }}>{r.description}</td>
                    <td>{r.jurisdiction}</td>
                    <td>{r.assignedOwner}</td>
                    <td><Pill status={r.verificationStatus} variant={r.verificationStatus === "Verified" ? "mint" : "amber"} /></td>
                    <td><Pill status={r.status} /></td>
                    <td className="mono">{formatDate(r.dateReceived)}</td>
                    <td className="mono">{formatDate(r.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selected && (
          <aside className="drawer" style={{ padding: 18 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{selected.id}</div>
            <h3 style={{ fontSize: 16, marginTop: 2 }}>{selected.type} request</h3>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <Pill status={selected.status} />
              <Pill status={selected.verificationStatus} variant={selected.verificationStatus === "Verified" ? "mint" : "amber"} />
            </div>
            <div style={{ marginTop: 10, fontSize: 13 }}>{selected.description}</div>

            <Field label="Owner">{selected.assignedOwner}</Field>
            <Field label="Received">{formatDate(selected.dateReceived)}</Field>
            <Field label="Due">{formatDate(selected.dueDate)}</Field>
            <Field label="Jurisdiction">{selected.jurisdiction}</Field>

            <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 12 }}>Workflow</h4>
            <ol style={{ paddingLeft: 18, fontSize: 12, marginTop: 6 }}>
              <li>Intake</li>
              <li>Identity / authority verification</li>
              <li>Scope and jurisdiction review</li>
              <li>Search relevant assets and systems</li>
              <li>Collect supporting evidence</li>
              <li>Human review</li>
              <li>Response preparation</li>
              <li>Completion and audit trail</li>
            </ol>

            {selAssets.length > 0 && (
              <>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 12 }}>Relevant assets</h4>
                {selAssets.map((a) => (
                  <Link key={a.id} href={`/assets?focus=${a.id}`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
                    <span className="mono">{a.id}</span> · {a.name}
                  </Link>
                ))}
              </>
            )}
            {selSystems.length > 0 && (
              <>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 12 }}>Relevant systems</h4>
                {selSystems.map((s) => (
                  <div key={s.id} style={{ marginTop: 4 }}>
                    <span className="mono">{s.id}</span> · {s.name}
                  </div>
                ))}
              </>
            )}
            <div className="banner" style={{ marginTop: 14 }}>
              Synthetic personal data is used for demonstration only. No actual sensitive information is stored.
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function SummaryStat({ label, value, variant }: { label: string; value: number; variant: "mint" | "amber" | "petrol" }) {
  const dotColor = variant === "mint" ? "var(--mw-accent)" : variant === "amber" ? "var(--mw-risk-warning)" : "var(--mw-petrol-dark)";
  return (
    <div className="praig-card" style={{ padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</div>
        <span className="status-dot" style={{ background: dotColor }} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
      <div style={{ fontSize: 11, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 13, marginTop: 2 }}>{children}</div>
    </div>
  );
}