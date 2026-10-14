"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDate, statusVariant } from "@/components/Pill";
import type { Incident, Exception, Asset, Evidence } from "@/lib/types";

export function IncidentsView({ incidents, exceptions, assets, evidence }: { incidents: Incident[]; exceptions: Exception[]; assets: Asset[]; evidence: Evidence[] }) {
  const [view, setView] = useState<"incidents" | "exceptions">("incidents");
  const [q, setQ] = useState("");
  const [severity, setSeverity] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(incidents[0]?.id ?? null);

  const filteredIncidents = useMemo(() => incidents.filter((i) => {
    if (q && !i.id.toLowerCase().includes(q.toLowerCase()) && !i.type.toLowerCase().includes(q.toLowerCase())) return false;
    if (severity !== "all" && i.severity !== severity) return false;
    return true;
  }), [incidents, q, severity]);

  const filteredExceptions = useMemo(() => exceptions.filter((e) => !q || e.requestedAction.toLowerCase().includes(q.toLowerCase()) || e.id.toLowerCase().includes(q.toLowerCase())), [exceptions, q]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Incidents & Exceptions</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Governance issues requiring investigation or authorised exception.
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <button className={`btn btn-sm ${view === "incidents" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("incidents")}>Incidents <span className="mono" style={{ marginLeft: 4 }}>{incidents.length}</span></button>
        <button className={`btn btn-sm ${view === "exceptions" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("exceptions")}>Exceptions <span className="mono" style={{ marginLeft: 4 }}>{exceptions.length}</span></button>
        <div style={{ flex: 1 }} />
        <input className="input" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 220 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: 16 }}>
        <section className="praig-card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            {view === "incidents" && (
              <table className="praig-table">
                <thead><tr><th>ID</th><th>Type</th><th>Severity</th><th>Asset</th><th>Owner</th><th>Status</th><th>Detected</th><th>Review deadline</th></tr></thead>
                <tbody>
                  {filteredIncidents.map((i) => (
                    <tr key={i.id} onClick={() => setSelectedId(i.id)} style={{ cursor: "pointer", background: i.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                      <td className="mono">{i.id}</td>
                      <td style={{ fontSize: 12 }}>{i.type}</td>
                      <td><Pill status={i.severity} variant={i.severity === "High" || i.severity === "Critical" ? "coral" : i.severity === "Medium" ? "amber" : "mint"} /></td>
                      <td className="mono" style={{ fontSize: 11 }}>{i.relatedAssetId ?? "—"}</td>
                      <td>{i.owner}</td>
                      <td><Pill status={i.status} /></td>
                      <td className="mono">{formatDate(i.dateDetected)}</td>
                      <td className="mono">{formatDate(i.reviewDeadline)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {view === "exceptions" && (
              <table className="praig-table">
                <thead><tr><th>ID</th><th>Action</th><th>Policy</th><th>Risk</th><th>Approver</th><th>Expires</th><th>Status</th></tr></thead>
                <tbody>
                  {filteredExceptions.map((e) => (
                    <tr key={e.id} onClick={() => setSelectedId(e.id)} style={{ cursor: "pointer", background: e.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                      <td className="mono">{e.id}</td>
                      <td style={{ fontSize: 12 }}>{e.requestedAction}</td>
                      <td className="mono">{e.relatedPolicy}</td>
                      <td><Pill status={e.risk} variant={e.risk === "High" || e.risk === "Critical" ? "coral" : e.risk === "Medium" ? "amber" : "mint"} /></td>
                      <td>{e.approver}</td>
                      <td className="mono">{formatDate(e.expiryDate)}</td>
                      <td><Pill status={e.reviewStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="praig-card" style={{ padding: 18 }}>
          {view === "incidents" ? (
            <IncidentDetail id={selectedId} incidents={incidents} assets={assets} evidence={evidence} />
          ) : (
            <ExceptionDetail id={selectedId} exceptions={exceptions} />
          )}
        </section>
      </div>
    </div>
  );
}

function IncidentDetail({ id, incidents, assets, evidence }: { id: string | null; incidents: Incident[]; assets: Asset[]; evidence: Evidence[] }) {
  const i = incidents.find((x) => x.id === id);
  if (!i) return <div className="empty-state">Select an incident.</div>;
  const linkedAsset = i.relatedAssetId ? assets.find((a) => a.id === i.relatedAssetId) : null;
  const linkedEvidence = evidence.filter((e) => e.relatedIncidentId === i.id);
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{i.id}</div>
      <h3 style={{ fontSize: 18, marginTop: 2 }}>{i.type}</h3>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <Pill status={i.severity} variant={i.severity === "High" || i.severity === "Critical" ? "coral" : i.severity === "Medium" ? "amber" : "mint"} />
        <Pill status={i.status} />
      </div>
      <p style={{ fontSize: 13, marginTop: 12 }}>{i.description}</p>
      <Field label="Owner">{i.owner}</Field>
      <Field label="Business unit">{i.businessUnit}</Field>
      <Field label="Detected">{formatDate(i.dateDetected)}</Field>
      <Field label="Review deadline">{formatDate(i.reviewDeadline)}</Field>
      {i.containment && <Field label="Containment">{i.containment}</Field>}
      <Field label="Data categories">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {i.dataCategories.map((c) => <span key={c} className="tag">{c}</span>)}
        </div>
      </Field>
      {linkedAsset && (
        <Field label="Related asset">
          <Link href={`/assets?focus=${linkedAsset.id}`}>
            <span className="mono">{linkedAsset.id}</span> · {linkedAsset.name}
          </Link>
        </Field>
      )}
      {linkedEvidence.length > 0 && (
        <>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 12, marginBottom: 6 }}>Evidence</h4>
          {linkedEvidence.map((e) => (
            <Link key={e.id} href={`/evidence?focus=${e.id}`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
              <span className="mono">{e.id}</span> · {e.title}
            </Link>
          ))}
        </>
      )}
      <div className="banner" style={{ marginTop: 14 }}>
        This prototype does not represent an actual incident-response or monitoring system.
      </div>
    </div>
  );
}

function ExceptionDetail({ id, exceptions }: { id: string | null; exceptions: Exception[] }) {
  const e = exceptions.find((x) => x.id === id);
  if (!e) return <div className="empty-state">Select an exception.</div>;
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{e.id}</div>
      <h3 style={{ fontSize: 18, marginTop: 2 }}>{e.requestedAction}</h3>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <Pill status={e.reviewStatus} />
        <Pill status={e.risk + " risk"} variant={e.risk === "High" || e.risk === "Critical" ? "coral" : e.risk === "Medium" ? "amber" : "mint"} />
      </div>
      <Field label="Business justification">{e.businessJustification}</Field>
      <Field label="Related policy">{e.relatedPolicy}</Field>
      <Field label="Related asset">{e.relatedAsset ?? "—"}</Field>
      <Field label="Compensating control">{e.compensatingControl ?? "—"}</Field>
      <Field label="Approver">{e.approver}</Field>
      <Field label="Expiry">{formatDate(e.expiryDate)}</Field>
      <div className="banner" style={{ marginTop: 14 }}>
        Expired exceptions become visible and require review. Synthetic demonstration only.
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