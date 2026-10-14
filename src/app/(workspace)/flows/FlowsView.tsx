"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDate } from "@/components/Pill";
import type { DataFlow, Asset, Vendor, AISystem, SystemRecord } from "@/lib/types";

export function FlowsView({
  flows, assets, vendors, aiSystems, systems, focus,
}: {
  flows: DataFlow[];
  assets: Asset[];
  vendors: Vendor[];
  aiSystems: AISystem[];
  systems: SystemRecord[];
  focus?: string;
}) {
  const [view, setView] = useState<"diagram" | "list">("diagram");
  const [srcFilter, setSrcFilter] = useState("all");
  const [destFilter, setDestFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(focus ?? flows[0]?.id ?? null);

  const filtered = useMemo(() => flows.filter((f) => {
    if (srcFilter !== "all" && (f.sourceAssetId !== srcFilter && f.sourceSystem !== srcFilter)) return false;
    if (destFilter !== "all" && (f.destinationAssetId !== destFilter && f.destinationSystem !== destFilter)) return false;
    if (classFilter !== "all" && f.classification !== classFilter) return false;
    if (statusFilter !== "all" && f.approvalStatus !== statusFilter) return false;
    return true;
  }), [flows, srcFilter, destFilter, classFilter, statusFilter]);

  const selected = filtered.find((f) => f.id === selectedId) ?? filtered[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24 }}>Data Mapping & Flows</h2>
          <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
            How information moves between systems, teams, vendors, and AI processors.
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className={`btn btn-sm ${view === "diagram" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("diagram")}>Diagram</button>
          <button className={`btn btn-sm ${view === "list" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("list")}>List</button>
        </div>
      </div>

      {/* Filters */}
      <section className="praig-card" style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div>
            <label>Source</label>
            <select className="input" value={srcFilter} onChange={(e) => setSrcFilter(e.target.value)} style={{ width: 180 }}>
              <option value="all">All</option>
              {assets.map((a) => <option key={a.id} value={a.id}>{a.id}</option>)}
              {systems.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
            </select>
          </div>
          <div>
            <label>Destination</label>
            <select className="input" value={destFilter} onChange={(e) => setDestFilter(e.target.value)} style={{ width: 180 }}>
              <option value="all">All</option>
              {assets.map((a) => <option key={a.id} value={a.id}>{a.id}</option>)}
              {systems.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
            </select>
          </div>
          <div>
            <label>Classification</label>
            <select className="input" value={classFilter} onChange={(e) => setClassFilter(e.target.value)} style={{ width: 180 }}>
              <option value="all">All</option>
              <option>Highly Sensitive</option>
              <option>Confidential</option>
              <option>Internal</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 180 }}>
              <option value="all">All</option>
              <option>Approved</option>
              <option>Approved with Conditions</option>
              <option>Under Review</option>
              <option>Restricted</option>
            </select>
          </div>
        </div>
      </section>

      {view === "diagram" ? (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "minmax(0, 1.5fr) minmax(0, 1fr)" : "1fr", gap: 16 }}>
          <section className="praig-card" style={{ padding: 16, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 className="section-title">Flow diagram</h3>
              <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--mw-text-muted)" }}>
                <Legend color="var(--mw-primary)" label="Source" />
                <Legend color="var(--mw-seafoam)" label="Transform" />
                <Legend color="var(--mw-accent)" label="Permitted" />
                <Legend color="var(--mw-risk-critical)" label="Blocked" />
              </div>
            </div>
            <FlowDiagram flows={filtered} selectedId={selectedId} onSelect={setSelectedId} />
            <div style={{ marginTop: 12 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Selected flow</h4>
              <select className="input" value={selectedId ?? ""} onChange={(e) => setSelectedId(e.target.value)}>
                {filtered.map((f) => <option key={f.id} value={f.id}>{f.id} · {f.name}</option>)}
              </select>
            </div>
          </section>

          {selected && <FlowDetail flow={selected} assets={assets} vendors={vendors} aiSystems={aiSystems} />}
        </div>
      ) : (
        <section className="praig-card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="praig-table">
              <thead>
                <tr>
                  <th>Flow ID</th>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Categories</th>
                  <th>Purpose</th>
                  <th>Type</th>
                  <th>Classification</th>
                  <th>Status</th>
                  <th>Last reviewed</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id} onClick={() => setSelectedId(f.id)} style={{ cursor: "pointer", background: f.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                    <td className="mono">{f.id}</td>
                    <td style={{ fontWeight: 600 }}>{f.name}</td>
                    <td className="mono" style={{ fontSize: 11 }}>{f.sourceAssetId ?? f.sourceSystem}</td>
                    <td className="mono" style={{ fontSize: 11 }}>{f.destinationAssetId ?? f.destinationSystem}</td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {f.dataCategories.slice(0, 2).map((c) => <span key={c} className="tag">{c}</span>)}
                        {f.dataCategories.length > 2 && <span className="tag">+{f.dataCategories.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{f.businessPurpose}</td>
                    <td><Pill status={f.destinationType} variant={f.destinationType === "AI Processor" ? "petrol" : f.destinationType === "External" ? "seafoam" : "mint"} /></td>
                    <td><Pill status={f.classification} variant={f.classification.includes("Sensitive") ? "coral" : "amber"} /></td>
                    <td><Pill status={f.approvalStatus} /></td>
                    <td className="mono">{formatDate(f.lastReviewed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: color }} />
      {label}
    </span>
  );
}

function FlowDetail({ flow, assets, vendors, aiSystems }: {
  flow: DataFlow; assets: Asset[]; vendors: Vendor[]; aiSystems: AISystem[];
}) {
  const source = flow.sourceAssetId ? assets.find((a) => a.id === flow.sourceAssetId) : null;
  const destination = flow.destinationAssetId ? assets.find((a) => a.id === flow.destinationAssetId) : null;
  const vendor = flow.vendorId ? vendors.find((v) => v.id === flow.vendorId) : null;
  const ai = flow.aiSystemId ? aiSystems.find((a) => a.id === flow.aiSystemId) : null;
  return (
    <aside className="drawer" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--mw-border)" }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{flow.id}</div>
        <h3 style={{ fontSize: 16, marginTop: 2 }}>{flow.name}</h3>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <Pill status={flow.classification} variant={flow.classification.includes("Sensitive") ? "coral" : "amber"} />
          <Pill status={flow.approvalStatus} />
          <Pill status={flow.destinationType} variant={flow.destinationType === "AI Processor" ? "petrol" : "seafoam"} />
        </div>
      </div>
      <div style={{ padding: 18, overflowY: "auto", maxHeight: "calc(100vh - 380px)" }}>
        <Field label="Source">{source ? <Link href={`/assets?focus=${source.id}`}>{source.name}</Link> : (flow.sourceSystem ?? "—")}</Field>
        <Field label="Destination">{destination ? <Link href={`/assets?focus=${destination.id}`}>{destination.name}</Link> : (flow.destinationSystem ?? "—")}</Field>
        <Field label="Business purpose">{flow.businessPurpose}</Field>
        <Field label="Transfer method">{flow.transferMethod}</Field>
        <Field label="Jurisdictions">{flow.jurisdictions.join(", ")}</Field>
        <Field label="Data categories">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {flow.dataCategories.map((c) => <span key={c} className="tag">{c}</span>)}
          </div>
        </Field>
        {vendor && (
          <Field label="Vendor"><Link href={`/vendors?focus=${vendor.id}`}>{vendor.name}</Link></Field>
        )}
        {ai && (
          <Field label="AI system"><Link href={`/ai-systems?focus=${ai.id}`}>{ai.name}</Link></Field>
        )}
        <Field label="Last reviewed">{formatDate(flow.lastReviewed)}</Field>
        <div className="banner" style={{ marginTop: 12 }}>
          Approval status is populated. A populated approval is not evidence that the flow was verified against current obligations.
        </div>
      </div>
    </aside>
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

function FlowDiagram({ flows, selectedId, onSelect }: { flows: DataFlow[]; selectedId: string | null; onSelect: (id: string) => void }) {
  // Build a simple diagram: show selected flow expanded as a graph; otherwise show summary cards.
  const selected = flows.find((f) => f.id === selectedId) ?? flows[0];
  if (!selected) return <div className="empty-state">No flows match filters.</div>;

  // Layout positions
  const w = 800;
  const h = 360;
  const srcX = 80, dstX = 700;
  const yMid = h / 2;

  // Nodes
  const sourceY = 70;
  const transformY = 140;
  const gwY = 200;
  const decisionY = 260;

  const blocked = selected.approvalStatus === "Restricted" || selected.approvalStatus === "Rejected";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 360, background: "#FAFBFC", borderRadius: 6, border: "1px solid var(--mw-border)" }}>
      {/* Connections */}
      <path d={`M ${srcX + 110} ${sourceY + 30} C ${(srcX + dstX) / 2} ${sourceY + 30}, ${(srcX + dstX) / 2} ${transformY + 30}, ${dstX - 130} ${transformY + 30}`} className="flow-line" />
      <path d={`M ${dstX - 130} ${transformY + 30} L ${dstX - 70} ${gwY + 30}`} className={blocked ? "flow-line-blocked" : "flow-line-active"} />
      <path d={`M ${dstX - 50} ${gwY + 60} L ${dstX - 50} ${decisionY}`} className="flow-line" />
      {/* Branch lines */}
      <path d={`M ${dstX - 60} ${decisionY + 20} l 50 0`} className="flow-line-active" />
      <path d={`M ${dstX - 60} ${decisionY + 40} l 50 0`} className="flow-line-blocked" />

      {/* Source */}
      <g transform={`translate(${srcX}, ${sourceY})`}>
        <rect width={110} height={60} rx={6} className="flow-node-primary" />
        <text x={55} y={28} textAnchor="middle" fill="#FFFFFF" fontSize={11} fontFamily="var(--font-display)" fontWeight={700}>SOURCE</text>
        <text x={55} y={46} textAnchor="middle" fill="#FFFFFF" fontSize={9.5} fontFamily="var(--font-mono)">{selected.sourceAssetId ?? selected.sourceSystem}</text>
      </g>
      {/* Transform */}
      <g transform={`translate(${dstX - 130}, ${transformY})`}>
        <rect width={120} height={60} rx={6} className="flow-node-seafoam" />
        <text x={60} y={28} textAnchor="middle" fill="#FFFFFF" fontSize={11} fontFamily="var(--font-display)" fontWeight={700}>TRANSFORM</text>
        <text x={60} y={46} textAnchor="middle" fill="#FFFFFF" fontSize={9.5} fontFamily="var(--font-mono)">{selected.classification}</text>
      </g>
      {/* Gateway */}
      <g transform={`translate(${dstX - 70}, ${gwY})`}>
        <rect width={140} height={60} rx={6} className="flow-node-petrol" />
        <text x={70} y={28} textAnchor="middle" fill="#FFFFFF" fontSize={11} fontFamily="var(--font-display)" fontWeight={700}>GATEWAY</text>
        <text x={70} y={46} textAnchor="middle" fill="#FFFFFF" fontSize={9.5} fontFamily="var(--font-mono)">{selected.transferMethod.slice(0, 18)}</text>
      </g>
      {/* Decision */}
      <g transform={`translate(${dstX - 60}, ${decisionY})`}>
        <rect width={120} height={20} rx={4} fill={blocked ? "var(--mw-risk-critical)" : "var(--mw-accent)"} />
        <text x={60} y={14} textAnchor="middle" fill={blocked ? "#FFFFFF" : "#003B2F"} fontSize={10} fontFamily="var(--font-display)" fontWeight={700}>
          {blocked ? "BLOCKED / ESCALATED" : "PERMITTED"}
        </text>
        <rect width={120} height={20} y={20} rx={4} fill="var(--mw-risk-warning)" />
        <text x={60} y={34} textAnchor="middle" fill="#5C2F00" fontSize={10} fontFamily="var(--font-display)" fontWeight={700}>REVIEW REQUIRED</text>
        <rect width={120} height={20} y={40} rx={4} fill="var(--mw-risk-critical)" />
        <text x={60} y={54} textAnchor="middle" fill="#FFFFFF" fontSize={10} fontFamily="var(--font-display)" fontWeight={700}>BLOCKED</text>
      </g>
    </svg>
  );
}