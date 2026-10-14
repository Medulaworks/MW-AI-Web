"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDate, formatDateTime } from "@/components/Pill";
import type { Evidence, AuditEvent, Control, Asset } from "@/lib/types";

export function EvidenceView({ evidence, audit, controls, assets, focus }: { evidence: Evidence[]; audit: AuditEvent[]; controls: Control[]; assets: Asset[]; focus?: string }) {
  const [view, setView] = useState<"evidence" | "audit">("evidence");
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(focus ?? evidence[0]?.id ?? null);

  const filteredEvidence = useMemo(() => evidence.filter((e) => {
    if (q && !e.title.toLowerCase().includes(q.toLowerCase()) && !e.id.toLowerCase().includes(q.toLowerCase())) return false;
    if (type !== "all" && e.type !== type) return false;
    return true;
  }), [evidence, q, type]);

  const sortedAudit = useMemo(() => [...audit].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [audit]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Evidence & Audit</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Traceability for governance decisions. Synthetic audit events only — not tamper-proof production logs.
        </p>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <button className={`btn btn-sm ${view === "evidence" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("evidence")}>Evidence register</button>
        <button className={`btn btn-sm ${view === "audit" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("audit")}>Audit timeline</button>
      </div>

      {view === "evidence" && (
        <>
          <section className="praig-card" style={{ padding: 14 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 240px" }}>
                <label>Search</label>
                <input className="input" placeholder="Search evidence..." value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div>
                <label>Type</label>
                <select className="input" value={type} onChange={(e) => setType(e.target.value)} style={{ width: 200 }}>
                  <option value="all">All</option>
                  {Array.from(new Set(evidence.map((e) => e.type))).map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ alignSelf: "flex-end" }}>
                <button className="btn btn-primary btn-sm" onClick={() => alert("Synthetic prototype — evidence collection simulated.")}>+ Collect evidence</button>
              </div>
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
            <section className="praig-card" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Owner</th><th>Source</th><th>Status</th><th>Collected</th><th>Validity</th></tr></thead>
                  <tbody>
                    {filteredEvidence.map((e) => (
                      <tr key={e.id} onClick={() => setSelectedId(e.id)} style={{ cursor: "pointer", background: e.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                        <td className="mono">{e.id}</td>
                        <td style={{ fontWeight: 600 }}>{e.title}</td>
                        <td style={{ fontSize: 12 }}>{e.type}</td>
                        <td>{e.owner}</td>
                        <td style={{ fontSize: 12 }}>{e.source}</td>
                        <td><Pill status={e.status} variant={e.status === "Current" ? "mint" : e.status === "Gap Identified" ? "coral" : "amber"} /></td>
                        <td className="mono">{formatDate(e.dateCollected)}</td>
                        <td className="mono">{formatDate(e.validityDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {selectedId && <EvidenceDetail id={selectedId} evidence={evidence} controls={controls} assets={assets} />}
          </div>
        </>
      )}

      {view === "audit" && (
        <section className="praig-card">
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--mw-border)" }}>
            <h3 className="section-title">Audit timeline</h3>
            <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>Who did what, when, and why. Simulated for prototype only.</p>
          </div>
          <div style={{ padding: 18 }}>
            {sortedAudit.map((a) => (
              <div key={a.id} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ width: 140, fontSize: 11, color: "var(--mw-text-muted)" }} className="mono">{formatDateTime(a.timestamp)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.action}</div>
                  <div style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 2 }}>
                    <span className="mono">{a.record}</span> · {a.change}
                  </div>
                  {a.reason && <div style={{ fontSize: 12, marginTop: 4 }}>Reason: {a.reason}</div>}
                  <div style={{ fontSize: 11, color: "var(--mw-text-muted)", marginTop: 2 }}>By {a.actor}{a.relatedEvidence && <> · Evidence <span className="mono">{a.relatedEvidence}</span></>}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EvidenceDetail({ id, evidence, controls, assets }: { id: string; evidence: Evidence[]; controls: Control[]; assets: Asset[] }) {
  const e = evidence.find((x) => x.id === id);
  if (!e) return null;
  const linkedAsset = e.relatedAssetId ? assets.find((a) => a.id === e.relatedAssetId) : null;
  const linkedControl = e.relatedControlId ? controls.find((c) => c.id === e.relatedControlId) : null;
  return (
    <aside className="drawer" style={{ padding: 18 }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{e.id}</div>
      <h3 style={{ fontSize: 18, marginTop: 2 }}>{e.title}</h3>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <Pill status={e.status} variant={e.status === "Current" ? "mint" : e.status === "Gap Identified" ? "coral" : "amber"} />
        <Pill status={e.type} variant="petrol" />
      </div>
      <Field label="Owner">{e.owner}</Field>
      <Field label="Source">{e.source}</Field>
      <Field label="Collected">{formatDate(e.dateCollected)}</Field>
      <Field label="Valid until">{formatDate(e.validityDate)}</Field>
      <Field label="Access classification"><Pill status={e.accessClassification} variant={e.accessClassification === "Confidential" ? "amber" : "mint"} /></Field>
      {linkedAsset && (
        <Field label="Related asset">
          <Link href={`/assets?focus=${linkedAsset.id}`}>
            <span className="mono">{linkedAsset.id}</span> · {linkedAsset.name}
          </Link>
        </Field>
      )}
      {linkedControl && (
        <Field label="Related control">
          <Link href={`/controls?focus=${linkedControl.id}&tab=controls`}>
            <span className="mono">{linkedControl.id}</span> · {linkedControl.name}
          </Link>
        </Field>
      )}
      {e.relatedObligationId && <Field label="Obligation"><span className="mono">{e.relatedObligationId}</span></Field>}
      {e.relatedAssessmentId && <Field label="Assessment"><span className="mono">{e.relatedAssessmentId}</span></Field>}
      {e.relatedVendorId && <Field label="Vendor"><span className="mono">{e.relatedVendorId}</span></Field>}
      {e.relatedIncidentId && <Field label="Incident"><span className="mono">{e.relatedIncidentId}</span></Field>}
      <div className="banner" style={{ marginTop: 14 }}>
        In a static prototype these events are simulated and not represented as tamper-proof production audit logs.
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