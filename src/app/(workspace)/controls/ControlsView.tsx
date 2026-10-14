"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDate } from "@/components/Pill";
import type { Control, Obligation, Policy, Evidence, Asset } from "@/lib/types";

export function ControlsView({
  controls, obligations, policies, evidence, assets, focus, tab,
}: {
  controls: Control[];
  obligations: Obligation[];
  policies: Policy[];
  evidence: Evidence[];
  assets: Asset[];
  focus?: string;
  tab?: string;
}) {
  const [view, setView] = useState<"obligations" | "policies" | "controls">((tab as "obligations" | "policies" | "controls") || "obligations");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(focus ?? obligations[0]?.id ?? null);

  const filteredObligations = useMemo(() => obligations.filter((o) => !q || o.requirement.toLowerCase().includes(q.toLowerCase()) || o.id.toLowerCase().includes(q.toLowerCase())), [obligations, q]);
  const filteredPolicies = useMemo(() => policies.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.id.toLowerCase().includes(q.toLowerCase())), [policies, q]);
  const filteredControls = useMemo(() => controls.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase())), [controls, q]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Policies, Obligations & Controls</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Link requirements to controls and evidence. Navigate from obligation to control to evidence to asset.
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <button className={`btn btn-sm ${view === "obligations" ? "btn-primary" : "btn-ghost"}`} onClick={() => { setView("obligations"); setSelectedId(filteredObligations[0]?.id ?? null); }}>
          Obligations <span className="mono" style={{ marginLeft: 4 }}>{obligations.length}</span>
        </button>
        <button className={`btn btn-sm ${view === "policies" ? "btn-primary" : "btn-ghost"}`} onClick={() => { setView("policies"); setSelectedId(filteredPolicies[0]?.id ?? null); }}>
          Policies <span className="mono" style={{ marginLeft: 4 }}>{policies.length}</span>
        </button>
        <button className={`btn btn-sm ${view === "controls" ? "btn-primary" : "btn-ghost"}`} onClick={() => { setView("controls"); setSelectedId(filteredControls[0]?.id ?? null); }}>
          Controls <span className="mono" style={{ marginLeft: 4 }}>{controls.length}</span>
        </button>
        <div style={{ flex: 1 }} />
        <input className="input" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 220 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)", gap: 16 }}>
        <section className="praig-card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto", maxHeight: "calc(100vh - 360px)" }}>
            {view === "obligations" && (
              <table className="praig-table">
                <thead><tr><th>ID</th><th>Source</th><th>Jurisdiction</th><th>Requirement</th><th>Owner</th><th>Evidence</th><th>Review</th></tr></thead>
                <tbody>
                  {filteredObligations.map((o) => (
                    <tr key={o.id} onClick={() => setSelectedId(o.id)} style={{ cursor: "pointer", background: o.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                      <td className="mono">{o.id}</td>
                      <td>{o.source}</td>
                      <td>{o.jurisdiction}</td>
                      <td style={{ fontSize: 12 }}>{o.requirement}</td>
                      <td>{o.owner}</td>
                      <td><Pill status={o.evidenceStatus} variant={o.evidenceStatus === "Current" ? "mint" : o.evidenceStatus === "Gap Identified" ? "coral" : "amber"} /></td>
                      <td><Pill status={o.reviewStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {view === "policies" && (
              <table className="praig-table">
                <thead><tr><th>ID</th><th>Name</th><th>Version</th><th>Owner</th><th>Status</th><th>Effective</th><th>Next review</th></tr></thead>
                <tbody>
                  {filteredPolicies.map((p) => (
                    <tr key={p.id} onClick={() => setSelectedId(p.id)} style={{ cursor: "pointer", background: p.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                      <td className="mono">{p.id}</td>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td className="mono">{p.version}</td>
                      <td>{p.owner}</td>
                      <td><Pill status={p.approvalStatus} /></td>
                      <td className="mono">{formatDate(p.effectiveDate)}</td>
                      <td className="mono">{formatDate(p.nextReview)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {view === "controls" && (
              <table className="praig-table">
                <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Owner</th><th>Implementation</th><th>Frequency</th><th>Last test</th><th>Exceptions</th></tr></thead>
                <tbody>
                  {filteredControls.map((c) => (
                    <tr key={c.id} onClick={() => setSelectedId(c.id)} style={{ cursor: "pointer", background: c.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                      <td className="mono">{c.id}</td>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td style={{ fontSize: 12 }}>{c.category}</td>
                      <td>{c.owner}</td>
                      <td><Pill status={c.implementationStatus} variant={c.implementationStatus === "Implemented" ? "mint" : "amber"} /></td>
                      <td style={{ fontSize: 12 }}>{c.operatingFrequency}</td>
                      <td className="mono">{formatDate(c.lastTest)}</td>
                      <td>{c.exceptions > 0 ? <Pill status={String(c.exceptions)} variant="amber" /> : <span className="mono">0</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="praig-card" style={{ padding: 18 }}>
          {view === "obligations" && <ObligationDetail id={selectedId} obligations={obligations} controls={controls} policies={policies} evidence={evidence} />}
          {view === "policies" && <PolicyDetail id={selectedId} policies={policies} obligations={obligations} controls={controls} />}
          {view === "controls" && <ControlDetail id={selectedId} controls={controls} obligations={obligations} evidence={evidence} assets={assets} />}
        </section>
      </div>
    </div>
  );
}

function ObligationDetail({ id, obligations, controls, policies, evidence }: {
  id: string | null;
  obligations: Obligation[];
  controls: Control[];
  policies: Policy[];
  evidence: Evidence[];
}) {
  const o = obligations.find((x) => x.id === id);
  if (!o) return <div className="empty-state">Select an obligation.</div>;
  const linkedControls = controls.filter((c) => o.relatedControls.includes(c.id));
  const linkedPolicies = policies.filter((p) => o.relatedPolicies.includes(p.id));
  const linkedEvidence = evidence.filter((e) => e.relatedObligationId === o.id);
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{o.id}</div>
      <h3 style={{ fontSize: 18, marginTop: 2 }}>{o.requirement}</h3>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <Pill status={o.source} variant="petrol" />
        <Pill status={o.jurisdiction} variant="seafoam" />
        <Pill status={o.evidenceStatus} variant={o.evidenceStatus === "Current" ? "mint" : o.evidenceStatus === "Gap Identified" ? "coral" : "amber"} />
      </div>
      <Field label="Applicability">{o.applicability}</Field>
      <Field label="Owner">{o.owner}</Field>
      <Field label="Review status"><Pill status={o.reviewStatus} /></Field>

      {linkedControls.length > 0 && (
        <>
          <SectionLabel>Linked controls</SectionLabel>
          {linkedControls.map((c) => (
            <Link key={c.id} href={`/controls?focus=${c.id}&tab=controls`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
              <span className="mono">{c.id}</span> · {c.name}
            </Link>
          ))}
        </>
      )}
      {linkedPolicies.length > 0 && (
        <>
          <SectionLabel>Linked policies</SectionLabel>
          {linkedPolicies.map((p) => (
            <Link key={p.id} href={`/controls?focus=${p.id}&tab=policies`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
              <span className="mono">{p.id}</span> · {p.name}
            </Link>
          ))}
        </>
      )}
      {linkedEvidence.length > 0 && (
        <>
          <SectionLabel>Evidence</SectionLabel>
          {linkedEvidence.map((e) => (
            <Link key={e.id} href={`/evidence?focus=${e.id}`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
              <span className="mono">{e.id}</span> · {e.title}
            </Link>
          ))}
        </>
      )}
    </div>
  );
}

function PolicyDetail({ id, policies, obligations, controls }: {
  id: string | null;
  policies: Policy[];
  obligations: Obligation[];
  controls: Control[];
}) {
  const p = policies.find((x) => x.id === id);
  if (!p) return <div className="empty-state">Select a policy.</div>;
  const linkedObligations = obligations.filter((o) => p.relatedObligations.includes(o.id));
  const linkedControls = controls.filter((c) => p.relatedControls.includes(c.id));
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{p.id}</div>
      <h3 style={{ fontSize: 18, marginTop: 2 }}>{p.name}</h3>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <Pill status={p.approvalStatus} variant={p.approvalStatus === "Approved" ? "mint" : "amber"} />
        <span className="mono" style={{ fontSize: 12, padding: "2px 6px", borderRadius: 4, background: "var(--mw-surface-muted)" }}>{p.version}</span>
      </div>
      <Field label="Scope">{p.scope}</Field>
      <Field label="Owner">{p.owner}</Field>
      <Field label="Effective">{formatDate(p.effectiveDate)}</Field>
      <Field label="Next review">{formatDate(p.nextReview)}</Field>

      {linkedObligations.length > 0 && (
        <>
          <SectionLabel>Linked obligations</SectionLabel>
          {linkedObligations.map((o) => (
            <Link key={o.id} href={`/controls?focus=${o.id}&tab=obligations`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
              <span className="mono">{o.id}</span> · {o.requirement.slice(0, 60)}
            </Link>
          ))}
        </>
      )}
      {linkedControls.length > 0 && (
        <>
          <SectionLabel>Linked controls</SectionLabel>
          {linkedControls.map((c) => (
            <Link key={c.id} href={`/controls?focus=${c.id}&tab=controls`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
              <span className="mono">{c.id}</span> · {c.name}
            </Link>
          ))}
        </>
      )}
    </div>
  );
}

function ControlDetail({ id, controls, obligations, evidence, assets }: {
  id: string | null;
  controls: Control[];
  obligations: Obligation[];
  evidence: Evidence[];
  assets: Asset[];
}) {
  const c = controls.find((x) => x.id === id);
  if (!c) return <div className="empty-state">Select a control.</div>;
  const linkedObligations = obligations.filter((o) => c.relatedObligations.includes(o.id));
  const linkedEvidence = evidence.filter((e) => e.relatedControlId === c.id);
  const linkedAssets = c.relatedAssets.map((a) => assets.find((x) => x.id === a)).filter(Boolean) as Asset[];
  return (
    <div>
      <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{c.id}</div>
      <h3 style={{ fontSize: 18, marginTop: 2 }}>{c.name}</h3>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        <Pill status={c.implementationStatus} variant={c.implementationStatus === "Implemented" ? "mint" : "amber"} />
        <span className="tag">{c.type}</span>
        <span className="tag">{c.category}</span>
      </div>
      <Field label="Objective">{c.objective}</Field>
      <Field label="Operating frequency">{c.operatingFrequency}</Field>
      <Field label="Evidence requirement">{c.evidenceRequirement}</Field>
      <Field label="Last tested">{formatDate(c.lastTest)}</Field>
      <Field label="Exceptions">{c.exceptions}</Field>
      <Field label="Owner">{c.owner}</Field>

      {linkedObligations.length > 0 && (
        <>
          <SectionLabel>Linked obligations</SectionLabel>
          {linkedObligations.map((o) => (
            <Link key={o.id} href={`/controls?focus=${o.id}&tab=obligations`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
              <span className="mono">{o.id}</span> · {o.requirement.slice(0, 60)}
            </Link>
          ))}
        </>
      )}
      {linkedAssets.length > 0 && (
        <>
          <SectionLabel>Linked assets</SectionLabel>
          {linkedAssets.map((a) => (
            <Link key={a.id} href={`/assets?focus=${a.id}`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
              <span className="mono">{a.id}</span> · {a.name}
            </Link>
          ))}
        </>
      )}
      {linkedEvidence.length > 0 && (
        <>
          <SectionLabel>Evidence</SectionLabel>
          {linkedEvidence.map((e) => (
            <Link key={e.id} href={`/evidence?focus=${e.id}`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
              <span className="mono">{e.id}</span> · {e.title}
            </Link>
          ))}
        </>
      )}
      <div className="banner" style={{ marginTop: 14 }}>
        A populated control register is not a compliance conclusion. Verify evidence validity and last test.
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 14, marginBottom: 6 }}>{children}</h4>;
}