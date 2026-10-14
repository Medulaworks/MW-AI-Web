"use client";

import { useState } from "react";
import Link from "next/link";
import { Pill, formatDate, statusVariant } from "@/components/Pill";
import { useDemoState } from "@/lib/store";
import type { DiscoveryItem, Asset } from "@/lib/types";

export function DiscoveryView({ items, assets }: { items: DiscoveryItem[]; items2?: never; assets: Asset[] }) {
  const { state, hydrated, recordDiscoveryAction, reset } = useDemoState();
  const [filter, setFilter] = useState<"all" | "New" | "In Review" | "Confirmed" | "False Positive">("all");

  const mergedItems = items.map((d) => {
    const action = state.discoveryActions[d.id];
    if (!action) return d;
    let stateName = d.state;
    if (action.action === "confirm") stateName = "Confirmed";
    if (action.action === "falsePositive") stateName = "False Positive";
    if (action.action === "assign") stateName = "In Review";
    return { ...d, state: stateName, reviewer: action.action === "assign" ? "You" : d.reviewer };
  });

  const filtered = filter === "all" ? mergedItems : mergedItems.filter((d) => d.state === filter);

  const totalScans = 18;
  const lastRun = "2026-01-09 06:00 UTC";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24 }}>Data Discovery</h2>
          <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
            Discovery sources, candidate assets, and review queue. Static prototype — runs are simulated.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm("Reset demo state?")) reset(); }}>Reset demo</button>
          <button className="btn btn-primary btn-sm" onClick={() => alert("Synthetic prototype — new scan would be queued here.")}>Request new scan</button>
        </div>
      </div>

      {/* Discovery overview */}
      <section className="praig-card" style={{ padding: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 0 }}>
          <Stat label="Discovery sources" value="6" sub="S3, SharePoint, Snowflake, Databricks, Zendesk, Manual" />
          <Stat label="Last discovery run" value={lastRun.split(" ")[0]} sub={lastRun.split(" ").slice(1).join(" ")} />
          <Stat label="Assets discovered" value={mergedItems.length} sub="Across configured sources" />
          <Stat label="Unclassified" value={mergedItems.filter((d) => d.state === "New").length} sub="Awaiting first review" />
          <Stat label="Sensitive matches" value={mergedItems.filter((d) => d.detectedCategories.some((c) => c.includes("Health") || c.includes("Identity") || c.includes("Voice"))).length} sub="Detected patterns" />
          <Stat label="Failed / incomplete" value="0" sub="Healthy sources" />
        </div>
      </section>

      {/* Sources */}
      <section className="praig-card">
        <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--mw-border)" }}>
          <h3 className="section-title">Configured discovery sources</h3>
        </div>
        <div style={{ padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {[
            { name: "AWS S3 (apex-ml-corpus)", type: "Object Storage", last: "2026-01-09", findings: 4 },
            { name: "SharePoint — Risk & Compliance", type: "Document Repo", last: "2026-01-08", findings: 2 },
            { name: "Snowflake — Analytics", type: "Data Warehouse", last: "2026-01-09", findings: 5 },
            { name: "Databricks — Behavioural Lake", type: "Data Lake", last: "2026-01-07", findings: 3 },
            { name: "Zendesk — Support Tickets", type: "SaaS Connector", last: "2026-01-06", findings: 1 },
            { name: "Manual inventory uploads", type: "Manual", last: "2026-01-08", findings: 2 },
          ].map((s) => (
            <div key={s.name} className="praig-card" style={{ padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "var(--mw-text-muted)", marginTop: 2 }}>{s.type} · Last run {s.last}</div>
              <div style={{ marginTop: 6, fontSize: 12 }}>{s.findings} candidate(s)</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--mw-text-muted)" }}>Filter:</span>
        {(["all", "New", "In Review", "Confirmed", "False Positive"] as const).map((s) => (
          <button key={s} className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(s)}>
            {s === "all" ? "All" : s} {s !== "all" && <span className="mono">({mergedItems.filter((d) => d.state === s).length})</span>}
          </button>
        ))}
      </div>

      {/* Discovery queue */}
      <section className="praig-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="praig-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Source</th>
                <th>Location</th>
                <th>Proposed name</th>
                <th>Candidate classification</th>
                <th>Detection basis</th>
                <th>Categories</th>
                <th>Confidence</th>
                <th>State</th>
                <th>Reviewer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="mono">{d.id}</td>
                  <td>{d.source}</td>
                  <td style={{ fontSize: 12 }}>{d.location}</td>
                  <td style={{ fontWeight: 600 }}>{d.proposedName}</td>
                  <td><Pill status={d.candidateClassification} variant={d.candidateClassification.includes("Sensitive") ? "coral" : "amber"} /></td>
                  <td style={{ fontSize: 12 }}>{d.detectionBasis}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {d.detectedCategories.map((c) => <span key={c} className="tag">{c}</span>)}
                    </div>
                  </td>
                  <td className="mono">{d.confidence}%</td>
                  <td><Pill status={d.state} /></td>
                  <td>{d.reviewer}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {d.state !== "Confirmed" && (
                        <button className="btn btn-accent btn-sm" onClick={() => recordDiscoveryAction(d.id, "confirm")}>Confirm</button>
                      )}
                      {d.state !== "False Positive" && (
                        <button className="btn btn-ghost btn-sm" onClick={() => recordDiscoveryAction(d.id, "falsePositive")}>False +</button>
                      )}
                      {d.reviewer === "Unassigned" && (
                        <button className="btn btn-ghost btn-sm" onClick={() => recordDiscoveryAction(d.id, "assign")}>Assign me</button>
                      )}
                      {d.linkedAssetId && (
                        <Link className="btn btn-ghost btn-sm" href={`/assets?focus=${d.linkedAssetId}`}>Open asset</Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div style={{ padding: "4px 14px", borderRight: "1px solid #F1F5F9" }}>
      <div style={{ fontSize: 11, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginTop: 2 }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--mw-text-muted)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}