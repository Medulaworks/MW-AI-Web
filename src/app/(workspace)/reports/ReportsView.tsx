"use client";

import { useState } from "react";
import Link from "next/link";
import { Pill, formatDate } from "@/components/Pill";
import type { Asset, DataEgressEvent, DataFlow, Processing, AISystem, Vendor, Assessment, Control, Incident } from "@/lib/types";

const REPORTS = [
  { id: "RPT-0001", name: "Enterprise data-asset inventory", desc: "All registered assets with classification, ownership and last review.", resource: "assets" },
  { id: "RPT-0002", name: "Sensitive-data discovery summary", desc: "Detection sources, candidates and review states.", resource: "discovery" },
  { id: "RPT-0003", name: "Data-flow & external-processing register", desc: "All flows with sources, destinations, classifications and approval status.", resource: "flows" },
  { id: "RPT-0004", name: "Processing-activity register", desc: "Records of processing with categories, jurisdictions and lawful basis.", resource: "processing" },
  { id: "RPT-0005", name: "AI-system inventory", desc: "AI systems with risk tier, model provider and approval status.", resource: "ai" },
  { id: "RPT-0006", name: "AI and privacy risk summary", desc: "Assessments with inherent/residual risk and decisions.", resource: "assessments" },
  { id: "RPT-0007", name: "DPIA / PIA status", desc: "Status and outcomes of data protection impact assessments.", resource: "assessments" },
  { id: "RPT-0008", name: "Vendor governance summary", desc: "Vendors with reviews, contracts and open issues.", resource: "vendors" },
  { id: "RPT-0009", name: "Control effectiveness & evidence gaps", desc: "Controls with implementation status, last test, exceptions.", resource: "controls" },
  { id: "RPT-0010", name: "Data-egress decisions", desc: "Recent egress events with decisions and transformations.", resource: "events" },
  { id: "RPT-0011", name: "Open incidents & exceptions", desc: "Outstanding incidents and active exceptions.", resource: "incidents" },
  { id: "RPT-0012", name: "Executive governance summary", desc: "Headline metrics, coverage and priority actions.", resource: "executive" },
];

export function ReportsView({
  assets, events, flows, processing, ai, vendors, assessments, controls, incidents,
}: {
  assets: Asset[];
  events: DataEgressEvent[];
  flows: DataFlow[];
  processing: Processing[];
  ai: AISystem[];
  vendors: Vendor[];
  assessments: Assessment[];
  controls: Control[];
  incidents: Incident[];
}) {
  const [selected, setSelected] = useState(REPORTS[11]);
  const [scope, setScope] = useState<"all" | "high-risk" | "ai" | "external">("all");

  const today = new Date().toISOString().slice(0, 10);

  const previewAssets = assets.slice(0, 8);
  const previewFlows = flows.slice(0, 8);
  const previewEvents = events.slice(0, 8);
  const previewProc = processing.slice(0, 8);
  const previewAI = ai.slice(0, 8);
  const previewVendors = vendors.slice(0, 8);
  const previewAssessments = assessments.slice(0, 8);
  const previewControls = controls.slice(0, 8);
  const previewIncidents = incidents.slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Reports</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Pre-built report templates. Exports are simulated in this prototype — not active downloads.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.6fr)", gap: 16 }}>
        <section className="praig-card" style={{ padding: 14, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <h3 className="section-title" style={{ fontSize: 14 }}>Templates</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            {REPORTS.map((r) => (
              <button key={r.id} onClick={() => setSelected(r)} className={`praig-card hover-lift ${selected.id === r.id ? "" : ""}`} style={{
                padding: 12, textAlign: "left", cursor: "pointer",
                borderColor: selected.id === r.id ? "var(--mw-accent)" : "var(--mw-border)",
                background: selected.id === r.id ? "rgba(0, 201, 167, 0.04)" : undefined,
              }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--mw-text-muted)" }}>{r.id}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 2 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "var(--mw-text-muted)", marginTop: 4 }}>{r.desc}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="praig-card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{selected.id} · {today}</div>
              <h3 className="section-title" style={{ marginTop: 2 }}>{selected.name}</h3>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select className="input" value={scope} onChange={(e) => setScope(e.target.value as "all" | "high-risk" | "ai" | "external")} style={{ width: 160 }}>
                <option value="all">All records</option>
                <option value="high-risk">High-risk only</option>
                <option value="ai">AI only</option>
                <option value="external">External only</option>
              </select>
              <button className="btn btn-ghost btn-sm" disabled title="Simulated export">Export (simulated)</button>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 6 }}>{selected.desc}</p>

          {/* Preview */}
          <div style={{ marginTop: 14, border: "1px solid var(--mw-border)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ background: "var(--mw-surface-muted)", padding: "8px 12px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--mw-text-muted)" }}>
              Preview · Source records · Generated {today}
            </div>
            <div style={{ padding: 14 }}>
              {selected.resource === "executive" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                    <Stat label="Assets" value={assets.length} />
                    <Stat label="AI systems" value={ai.length} />
                    <Stat label="Processing" value={processing.length} />
                    <Stat label="Vendors" value={vendors.length} />
                    <Stat label="Assessments" value={assessments.length} />
                    <Stat label="Open incidents" value={incidents.filter((i) => i.status !== "Completed" && i.status !== "Mitigated").length} />
                  </div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 14 }}>Priority actions</h4>
                  <ul style={{ paddingLeft: 18, fontSize: 12, marginTop: 6 }}>
                    <li>Confirm retention owner for AST-0006 marketing analytics</li>
                    <li>Complete assessment for AIS-0005 trial operations co-pilot</li>
                    <li>Refresh vendor evidence for VND-0003 analytics provider</li>
                    <li>Validate discovery candidate DISC-0001 voice recordings</li>
                  </ul>
                </div>
              )}

              {selected.resource === "assets" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Class</th><th>Owner</th><th>Reviewed</th></tr></thead>
                  <tbody>{previewAssets.map((a) => <tr key={a.id}><td className="mono">{a.id}</td><td>{a.name}</td><td>{a.classification}</td><td>{a.owner}</td><td className="mono">{formatDate(a.lastReviewed)}</td></tr>)}</tbody>
                </table>
              )}
              {selected.resource === "flows" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Source</th><th>Destination</th><th>Status</th></tr></thead>
                  <tbody>{previewFlows.map((f) => <tr key={f.id}><td className="mono">{f.id}</td><td>{f.name}</td><td className="mono" style={{ fontSize: 11 }}>{f.sourceAssetId ?? f.sourceSystem}</td><td className="mono" style={{ fontSize: 11 }}>{f.destinationAssetId ?? f.destinationSystem}</td><td><Pill status={f.approvalStatus} /></td></tr>)}</tbody>
                </table>
              )}
              {selected.resource === "events" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>User</th><th>Class</th><th>Decision</th></tr></thead>
                  <tbody>{previewEvents.map((e) => <tr key={e.id}><td className="mono">{e.id}</td><td>{e.user}</td><td>{e.detectedClass}</td><td><Pill status={e.decision} /></td></tr>)}</tbody>
                </table>
              )}
              {selected.resource === "processing" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Activity</th><th>Controller</th><th>Lawful basis</th></tr></thead>
                  <tbody>{previewProc.map((p) => <tr key={p.id}><td className="mono">{p.id}</td><td>{p.name}</td><td>{p.controller}</td><td>{p.lawfulBasis}</td></tr>)}</tbody>
                </table>
              )}
              {selected.resource === "ai" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Provider</th><th>Tier</th><th>Approval</th></tr></thead>
                  <tbody>{previewAI.map((i) => <tr key={i.id}><td className="mono">{i.id}</td><td>{i.name}</td><td>{i.modelProvider}</td><td>{i.riskTier}</td><td><Pill status={i.approvalStatus} /></td></tr>)}</tbody>
                </table>
              )}
              {selected.resource === "vendors" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Service</th><th>DPA</th><th>Issues</th></tr></thead>
                  <tbody>{previewVendors.map((v) => <tr key={v.id}><td className="mono">{v.id}</td><td>{v.name}</td><td>{v.serviceType}</td><td><Pill status={v.dpaStatus} /></td><td>{v.openIssues}</td></tr>)}</tbody>
                </table>
              )}
              {selected.resource === "assessments" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Type</th><th>Inherent</th><th>Residual</th><th>Status</th></tr></thead>
                  <tbody>{previewAssessments.map((a) => <tr key={a.id}><td className="mono">{a.id}</td><td>{a.type}</td><td>{a.inherentRisk}</td><td>{a.residualRisk}</td><td><Pill status={a.status} /></td></tr>)}</tbody>
                </table>
              )}
              {selected.resource === "controls" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Status</th><th>Last test</th><th>Exceptions</th></tr></thead>
                  <tbody>{previewControls.map((c) => <tr key={c.id}><td className="mono">{c.id}</td><td>{c.name}</td><td><Pill status={c.implementationStatus} /></td><td className="mono">{formatDate(c.lastTest)}</td><td>{c.exceptions}</td></tr>)}</tbody>
                </table>
              )}
              {selected.resource === "incidents" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Type</th><th>Severity</th><th>Status</th><th>Owner</th></tr></thead>
                  <tbody>{previewIncidents.map((i) => <tr key={i.id}><td className="mono">{i.id}</td><td>{i.type}</td><td><Pill status={i.severity} /></td><td><Pill status={i.status} /></td><td>{i.owner}</td></tr>)}</tbody>
                </table>
              )}
              {selected.resource === "discovery" && (
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Source</th><th>Proposed name</th><th>Candidate class</th><th>State</th></tr></thead>
                  <tbody>{previewAI.slice(0, 4).map((i) => <tr key={i.id}><td className="mono">{i.id}</td><td>{i.modelProvider}</td><td>{i.name}</td><td>{i.riskTier}</td><td><Pill status={i.approvalStatus} /></td></tr>)}</tbody>
                </table>
              )}
            </div>
          </div>
          <div className="banner" style={{ marginTop: 12 }}>
            Reports are previewed from current synthetic data only. The prototype does not export real files.
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ padding: "8px 12px", background: "var(--mw-surface-muted)", borderRadius: 6 }}>
      <div style={{ fontSize: 11, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}