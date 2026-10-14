"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDate, statusVariant } from "@/components/Pill";
import type { Assessment, Control, Asset, Processing, AISystem } from "@/lib/types";

const RISK_TYPES = ["DPIA", "AI System Risk Assessment", "Third-Party Risk Assessment", "Data-Egress Risk Review", "Data-Flow Change Assessment", "Data Retention Review"];

export function AssessmentsView({
  assessments, controls, assets, processing, ai, focus,
}: {
  assessments: Assessment[];
  controls: Control[];
  assets: Asset[];
  processing: Processing[];
  ai: AISystem[];
  focus?: string;
}) {
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(focus ?? assessments[0]?.id ?? null);

  const filtered = useMemo(() => assessments.filter((a) => {
    if (q) {
      const ql = q.toLowerCase();
      if (!a.id.toLowerCase().includes(ql) && !a.purpose.toLowerCase().includes(ql) && !a.scope.toLowerCase().includes(ql)) return false;
    }
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  }), [assessments, q, typeFilter, statusFilter]);

  const selected = filtered.find((a) => a.id === selectedId) ?? filtered[0];

  // Risk matrix data
  const matrix = [
    [{ level: "Low", color: "var(--mw-accent)" }, { level: "Low", color: "var(--mw-accent)" }, { level: "Medium", color: "var(--mw-risk-warning)" }, { level: "High", color: "var(--mw-risk-critical)" }],
    [{ level: "Low", color: "var(--mw-accent)" }, { level: "Medium", color: "var(--mw-risk-warning)" }, { level: "High", color: "var(--mw-risk-critical)" }, { level: "Critical", color: "var(--mw-risk-critical)" }],
    [{ level: "Medium", color: "var(--mw-risk-warning)" }, { level: "High", color: "var(--mw-risk-critical)" }, { level: "Critical", color: "var(--mw-risk-critical)" }, { level: "Critical", color: "var(--mw-risk-critical)" }],
    [{ level: "Medium", color: "var(--mw-risk-warning)" }, { level: "High", color: "var(--mw-risk-critical)" }, { level: "Critical", color: "var(--mw-risk-critical)" }, { level: "Critical", color: "var(--mw-risk-critical)" }],
  ];
  const likelihoods = ["Low", "Medium", "High", "Very High"];
  const impacts = ["Low", "Medium", "High", "Severe"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Risk & Impact Assessments</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Privacy, AI, third-party and data-flow assessments with configurable methodology.
        </p>
      </div>

      <section className="praig-card" style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px" }}>
            <label>Search</label>
            <input className="input" placeholder="Search assessments..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <label>Type</label>
            <select className="input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ width: 200 }}>
              <option value="all">All</option>
              {RISK_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 180 }}>
              <option value="all">All</option>
              <option>Completed</option>
              <option>In Progress</option>
              <option>Draft</option>
            </select>
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn btn-primary btn-sm" onClick={() => alert("Synthetic prototype — assessment creation simulated.")}>+ Start assessment</button>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "minmax(0, 1.4fr) minmax(0, 1fr)" : "1fr", gap: 16 }}>
        <section className="praig-card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto", maxHeight: "calc(100vh - 360px)" }}>
            <table className="praig-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Purpose</th>
                  <th>Related</th>
                  <th>Owner</th>
                  <th>Inherent</th>
                  <th>Residual</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} onClick={() => setSelectedId(a.id)} style={{ cursor: "pointer", background: a.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                    <td className="mono">{a.id}</td>
                    <td>{a.type}</td>
                    <td style={{ fontSize: 12 }}>{a.purpose}</td>
                    <td className="mono" style={{ fontSize: 11 }}>{a.relatedRecordId ?? "—"}</td>
                    <td>{a.owner}</td>
                    <td><Pill status={a.inherentRisk} variant={a.inherentRisk === "Critical" || a.inherentRisk === "High" ? "coral" : a.inherentRisk === "Medium" ? "amber" : "mint"} /></td>
                    <td><Pill status={a.residualRisk} variant={a.residualRisk === "Critical" || a.residualRisk === "High" ? "coral" : a.residualRisk === "Medium" ? "amber" : "mint"} /></td>
                    <td><Pill status={a.status} /></td>
                    <td className="mono">{formatDate(a.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selected && (
          <aside className="drawer" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--mw-border)" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{selected.id}</div>
              <h3 style={{ fontSize: 16, marginTop: 2 }}>{selected.type}</h3>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <Pill status={selected.status} />
                <Pill status={"Inherent " + selected.inherentRisk} variant={selected.inherentRisk === "Critical" || selected.inherentRisk === "High" ? "coral" : selected.inherentRisk === "Medium" ? "amber" : "mint"} />
                <Pill status={"Residual " + selected.residualRisk} variant={selected.residualRisk === "Critical" || selected.residualRisk === "High" ? "coral" : selected.residualRisk === "Medium" ? "amber" : "mint"} />
              </div>
            </div>
            <div style={{ padding: 18, overflowY: "auto", maxHeight: "calc(100vh - 380px)" }}>
              <Field label="Purpose">{selected.purpose}</Field>
              <Field label="Scope">{selected.scope}</Field>
              <Field label="Owner">{selected.owner}</Field>
              <Field label="Reviewer">{selected.reviewer ?? "—"}</Field>
              <Field label="Related record">
                {selected.relatedRecordType === "ProcessingActivity" && processing.find((p) => p.id === selected.relatedRecordId)?.name}
                {selected.relatedRecordType === "AISystem" && ai.find((a) => a.id === selected.relatedRecordId)?.name}
                {selected.relatedRecordType === "Vendor" && selected.relatedRecordId}
                {selected.relatedRecordType === "Asset" && assets.find((a) => a.id === selected.relatedRecordId)?.name}
                {selected.relatedRecordType === "DataFlow" && selected.relatedRecordId}
              </Field>
              <Field label="Data categories">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {selected.dataCategories.map((c) => <span key={c} className="tag">{c}</span>)}
                </div>
              </Field>
              <Field label="Affected individuals">{selected.affectedIndividuals.join(", ")}</Field>
              <Field label="Risk factors">
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {selected.riskFactors.map((r) => <div key={r} style={{ fontSize: 12 }}>• {r}</div>)}
                </div>
              </Field>
              <Field label="Existing controls">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {selected.existingControls.map((c) => <Link key={c} href={`/controls?focus=${c}`} className="tag" style={{ textDecoration: "none" }}>{c}</Link>)}
                </div>
              </Field>
              <Field label="Mitigation actions">
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {selected.mitigationActions.map((r) => <div key={r} style={{ fontSize: 12 }}>• {r}</div>)}
                </div>
              </Field>
              <Field label="Approval decision">{selected.approvalDecision ?? "—"}</Field>
              <Field label="Due date">{formatDate(selected.dueDate)}</Field>

              <div style={{ marginTop: 12 }}>
                <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Risk matrix (illustrative)</h4>
                <div style={{ display: "grid", gridTemplateColumns: "60px repeat(4, 1fr)", gap: 3 }}>
                  <div />
                  {impacts.map((i) => <div key={i} style={{ fontSize: 10, fontWeight: 600, color: "var(--mw-text-muted)", textAlign: "center" }}>{i}</div>)}
                  {matrix.map((row, ri) => (
                    <>
                      <div key={`l-${ri}`} style={{ fontSize: 10, fontWeight: 600, color: "var(--mw-text-muted)", display: "flex", alignItems: "center" }}>{likelihoods[ri]}</div>
                      {row.map((cell, ci) => (
                        <div key={`${ri}-${ci}`} className="risk-cell" style={{ background: cell.color }}>{cell.level}</div>
                      ))}
                    </>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "var(--mw-text-muted)", marginTop: 6 }}>Numeric scores are not implied to be objective measures.</p>
              </div>
            </div>
          </aside>
        )}
      </div>
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