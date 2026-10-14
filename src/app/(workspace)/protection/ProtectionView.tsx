"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDateTime } from "@/components/Pill";
import type { DataEgressEvent, Asset, AISystem } from "@/lib/types";

export function ProtectionView({
  events, assets, aiSystems,
}: {
  events: DataEgressEvent[];
  assets: Asset[];
  aiSystems: AISystem[];
}) {
  const [tab, setTab] = useState<"events" | "policy" | "simulator">("events");
  const [q, setQ] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(events[0]?.id ?? null);

  const filtered = useMemo(() => events.filter((e) => {
    if (q && !e.id.toLowerCase().includes(q.toLowerCase()) && !e.user.toLowerCase().includes(q.toLowerCase()) && !e.destination.toLowerCase().includes(q.toLowerCase())) return false;
    if (decisionFilter !== "all" && e.decision !== decisionFilter) return false;
    return true;
  }), [events, q, decisionFilter]);

  const selected = filtered.find((e) => e.id === selectedId) ?? filtered[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Protection & Data Egress</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Govern data exposure and the use of external AI processors. Simulated decisions and synthetic events only.
        </p>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <button className={`btn btn-sm ${tab === "events" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("events")}>Data-egress events</button>
        <button className={`btn btn-sm ${tab === "policy" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("policy")}>Gateway & policy configuration</button>
        <button className={`btn btn-sm ${tab === "simulator" ? "btn-primary" : "btn-ghost"}`} onClick={() => setTab("simulator")}>Decision simulator</button>
      </div>

      {tab === "events" && (
        <>
          <section className="praig-card" style={{ padding: 14 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 240px" }}>
                <label>Search</label>
                <input className="input" placeholder="Search events..." value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div>
                <label>Decision</label>
                <select className="input" value={decisionFilter} onChange={(e) => setDecisionFilter(e.target.value)} style={{ width: 200 }}>
                  <option value="all">All</option>
                  <option>Allowed</option>
                  <option>Allowed after redaction</option>
                  <option>Pseudonymised before release</option>
                  <option>Blocked</option>
                  <option>Pending review</option>
                  <option>Exception requested</option>
                </select>
              </div>
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 16 }}>
            <section className="praig-card" style={{ overflow: "hidden" }}>
              <div style={{ overflowX: "auto", maxHeight: "calc(100vh - 360px)" }}>
                <table className="praig-table">
                  <thead><tr><th>ID</th><th>Time</th><th>User</th><th>Source</th><th>Destination</th><th>Detected class</th><th>Policy</th><th>Decision</th><th>Review</th></tr></thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr key={e.id} onClick={() => setSelectedId(e.id)} style={{ cursor: "pointer", background: e.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                        <td className="mono">{e.id}</td>
                        <td className="mono" style={{ fontSize: 11, whiteSpace: "nowrap" }}>{formatDateTime(e.timestamp)}</td>
                        <td>{e.user}</td>
                        <td style={{ fontSize: 12 }}>{e.sourceApp}</td>
                        <td style={{ fontSize: 12 }}>{e.destination}</td>
                        <td>{e.detectedClass}</td>
                        <td style={{ fontSize: 12 }}>{e.policyApplied}</td>
                        <td><Pill status={e.decision} variant={
                          e.decision === "Blocked" ? "coral" :
                          e.decision === "Pending review" || e.decision === "Exception requested" ? "amber" :
                          "mint"
                        } /></td>
                        <td><Pill status={e.reviewStatus} variant={e.reviewStatus === "Logged" ? "mint" : "amber"} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {selected && (
              <aside className="drawer" style={{ padding: 18 }}>
                <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{selected.id}</div>
                <h3 style={{ fontSize: 16, marginTop: 2 }}>{selected.user}</h3>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <Pill status={selected.decision} variant={
                    selected.decision === "Blocked" ? "coral" :
                    selected.decision === "Pending review" || selected.decision === "Exception requested" ? "amber" :
                    "mint"
                  } />
                  <Pill status={selected.reviewStatus} />
                </div>
                <Field label="Timestamp">{formatDateTime(selected.timestamp)}</Field>
                <Field label="Source application">{selected.sourceApp}</Field>
                <Field label="Destination">{selected.destination}</Field>
                <Field label="Model / provider">{selected.modelProvider ?? "—"}</Field>
                <Field label="Detected class">{selected.detectedClass}</Field>
                <Field label="Policy applied">{selected.policyApplied}</Field>
                <Field label="Transformation">{selected.transformation ?? "—"}</Field>
                <Field label="Description">{selected.description}</Field>
                {selected.relatedAssetId && (
                  <Field label="Related asset">
                    <Link href={`/assets?focus=${selected.relatedAssetId}`}>
                      <span className="mono">{selected.relatedAssetId}</span> · {assets.find((a) => a.id === selected.relatedAssetId)?.name ?? ""}
                    </Link>
                  </Field>
                )}
                {selected.aiSystemId && (
                  <Field label="AI system">
                    <Link href={`/ai-systems?focus=${selected.aiSystemId}`}>
                      <span className="mono">{selected.aiSystemId}</span> · {aiSystems.find((a) => a.id === selected.aiSystemId)?.name ?? ""}
                    </Link>
                  </Field>
                )}
                <div className="banner" style={{ marginTop: 14 }}>
                  Synthetic event only — original request payload content is not stored in this prototype.
                </div>
              </aside>
            )}
          </div>
        </>
      )}

      {tab === "policy" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <section className="praig-card" style={{ padding: 18 }}>
            <h3 className="section-title">Policies in force</h3>
            <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>Synthetic demonstration policies. These do not inspect or enforce real egress.</p>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "Sensitive-data detection", desc: "Identify personal and special-category content before egress." },
                { name: "Redaction", desc: "Replace direct identifiers with placeholders before external calls." },
                { name: "Pseudonymisation", desc: "Use stable replacement identifiers so the recipient cannot directly identify subjects." },
                { name: "Anonymisation", desc: "Remove identifiers and aggregate so subjects cannot reasonably be re-identified." },
                { name: "Block rules", desc: "Prevent external transmission for prohibited classes." },
                { name: "Approved destinations", desc: "Maintain a list of approved processors and model endpoints." },
                { name: "Human approval", desc: "Route high-risk requests to a reviewer queue." },
                { name: "Audit logging", desc: "Record decision reason and evidence reference." },
              ].map((p) => (
                <div key={p.name} className="praig-card" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>{p.desc}</div>
                </div>
              ))}
            </div>
            <div className="banner" style={{ marginTop: 12 }}>
              Pseudonymisation and anonymisation are not interchangeable. Pseudonymisation still allows re-identification with additional information; anonymisation aims to prevent it.
            </div>
          </section>

          <section className="praig-card" style={{ padding: 18 }}>
            <h3 className="section-title">Example rules</h3>
            <ul style={{ paddingLeft: 18, fontSize: 13, marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Block external transmission of prohibited sensitive information.</li>
              <li>Redact specified identifiers before a request leaves an approved boundary.</li>
              <li>Permit a request only when the destination and data class are approved.</li>
              <li>Require human review for high-risk data and unapproved destinations.</li>
              <li>Keep a decision record for audit.</li>
            </ul>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 16, marginBottom: 8 }}>Approved destinations</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                "Approved AI Model Provider",
                "Approved Cloud Storage Provider",
                "Pharmacovigilance Cloud Reporting",
                "Internal Gateway",
              ].map((d) => (
                <div key={d} className="praig-card" style={{ padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{d}</span>
                  <Pill status="Approved" variant="mint" />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "simulator" && (
        <Simulator assets={assets} />
      )}
    </div>
  );
}

function Simulator({ assets }: { assets: Asset[] }) {
  const [sourceSystem, setSourceSystem] = useState("Digital Channels Suite");
  const [dataClass, setDataClass] = useState("Confidential");
  const [destination, setDestination] = useState("Approved AI Model Provider");
  const [sensitiveDetected, setSensitiveDetected] = useState(true);
  const [destinationApproved, setDestinationApproved] = useState(true);
  const [hasPolicy, setHasPolicy] = useState(true);
  const [result, setResult] = useState<{ decision: string; reason: string; transformation?: string } | null>(null);

  function runSimulator() {
    let decision = "Allowed";
    let reason = "Permitted data with approved destination and policy in place.";
    let transformation: string | undefined;
    if (!hasPolicy) {
      decision = "Pending review";
      reason = "No matching policy defined. Routing to reviewer queue.";
    } else if (sensitiveDetected && !destinationApproved) {
      decision = "Blocked";
      reason = "Sensitive data detected and destination not approved. Blocked at gateway.";
    } else if (sensitiveDetected && destinationApproved && hasPolicy) {
      decision = "Allowed after redaction";
      transformation = "Identifier redaction + hashing";
      reason = "Sensitive data detected. Policy mandates redaction before external transmission.";
    } else if (!sensitiveDetected && destinationApproved) {
      decision = "Allowed";
      reason = "Permitted data class. Approved destination.";
    }
    setResult({ decision, reason, transformation });
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 16 }}>
      <section className="praig-card" style={{ padding: 18 }}>
        <h3 className="section-title">Decision simulator</h3>
        <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Demonstrates policy logic. Does not intercept real requests or enforce a boundary.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <div>
            <label>Source system</label>
            <select className="input" value={sourceSystem} onChange={(e) => setSourceSystem(e.target.value)}>
              <option>Digital Channels Suite</option>
              <option>Core Banking Platform</option>
              <option>Customer Support Suite</option>
              <option>Marketing Engine</option>
              <option>Clinical Data Platform</option>
            </select>
          </div>
          <div>
            <label>Data classification</label>
            <select className="input" value={dataClass} onChange={(e) => setDataClass(e.target.value)}>
              <option>Highly Sensitive</option>
              <option>Confidential</option>
              <option>Internal</option>
              <option>Public</option>
            </select>
          </div>
          <div>
            <label>Destination</label>
            <select className="input" value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option>Approved AI Model Provider</option>
              <option>Approved Cloud Storage Provider</option>
              <option>Pharmacovigilance Cloud Reporting</option>
              <option>External Analytics Provider</option>
              <option>Unapproved External Endpoint</option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={sensitiveDetected} onChange={(e) => setSensitiveDetected(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Sensitive identifiers detected</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={destinationApproved} onChange={(e) => setDestinationApproved(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Destination is approved</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <input type="checkbox" checked={hasPolicy} onChange={(e) => setHasPolicy(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Relevant policy exists</span>
          </label>
          <button className="btn btn-primary btn-sm" onClick={runSimulator} style={{ marginTop: 4 }}>Run simulation</button>
        </div>
      </section>

      <section className="praig-card" style={{ padding: 18 }}>
        <h3 className="section-title">Simulated decision</h3>
        {!result ? (
          <div className="empty-state">Configure conditions and run the simulation.</div>
        ) : (
          <div style={{ marginTop: 12 }}>
            <div className="banner" style={{
              background: result.decision.includes("Blocked") ? "rgba(239,68,68,0.06)" : result.decision.includes("Pending") || result.decision.includes("review") ? "rgba(245,158,11,0.06)" : "rgba(0,201,167,0.06)",
              borderLeftColor: result.decision.includes("Blocked") ? "var(--mw-risk-critical)" : result.decision.includes("Pending") || result.decision.includes("review") ? "var(--mw-risk-warning)" : "var(--mw-accent)",
              fontSize: 14, fontWeight: 600,
            }}>
              Decision: {result.decision}
            </div>
            <div style={{ marginTop: 16 }}>
              <Field label="Reason">{result.reason}</Field>
              {result.transformation && <Field label="Transformation">{result.transformation}</Field>}
            </div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 16, marginBottom: 8 }}>Policy factors evaluated</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Data classification", value: dataClass },
                { label: "Sensitive identifiers", value: sensitiveDetected ? "Detected" : "Not detected" },
                { label: "Destination", value: destination },
                { label: "Destination approval", value: destinationApproved ? "Approved" : "Not approved" },
                { label: "Policy in force", value: hasPolicy ? "Yes" : "No" },
              ].map((f) => (
                <div key={f.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F1F5F9", fontSize: 12 }}>
                  <span style={{ color: "var(--mw-text-muted)" }}>{f.label}</span>
                  <span style={{ fontWeight: 600 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="banner" style={{ marginTop: 14 }}>
          This simulator demonstrates policy logic only. It does not intercept real requests or enforce a network boundary.
        </div>
      </section>
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