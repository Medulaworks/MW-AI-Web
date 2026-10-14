"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDate } from "@/components/Pill";
import type { Vendor, Asset, SystemRecord, DataFlow, Evidence } from "@/lib/types";

export function VendorsView({
  vendors, assets, systems, flows, evidence, focus,
}: {
  vendors: Vendor[];
  assets: Asset[];
  systems: SystemRecord[];
  flows: DataFlow[];
  evidence: Evidence[];
  focus?: string;
}) {
  const [q, setQ] = useState("");
  const [aiFilter, setAiFilter] = useState<"all" | "yes" | "no">("all");
  const [selectedId, setSelectedId] = useState<string | null>(focus ?? vendors[0]?.id ?? null);

  const filtered = useMemo(() => vendors.filter((v) => {
    if (q) {
      const ql = q.toLowerCase();
      if (!v.name.toLowerCase().includes(ql) && !v.id.toLowerCase().includes(ql) && !v.serviceType.toLowerCase().includes(ql)) return false;
    }
    if (aiFilter === "yes" && !v.aiUsage) return false;
    if (aiFilter === "no" && v.aiUsage) return false;
    return true;
  }), [vendors, q, aiFilter]);

  const selected = filtered.find((v) => v.id === selectedId) ?? filtered[0];
  const linkedAssets = selected ? selected.connectedAssets.map((id) => assets.find((a) => a.id === id)).filter(Boolean) as Asset[] : [];
  const linkedSystems = selected ? selected.connectedSystems.map((id) => systems.find((s) => s.id === id)).filter(Boolean) as SystemRecord[] : [];
  const linkedFlows = flows.filter((f) => f.vendorId === selectedId);
  const linkedEvidence = evidence.filter((e) => e.relatedVendorId === selectedId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Vendors & Third Parties</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          External organisations that process, receive, store or influence the use of organisational data.
        </p>
      </div>

      <section className="praig-card" style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px" }}>
            <label>Search</label>
            <input className="input" placeholder="Search vendors..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <label>AI usage</label>
            <select className="input" value={aiFilter} onChange={(e) => setAiFilter(e.target.value as "all" | "yes" | "no")} style={{ width: 160 }}>
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn btn-primary btn-sm" onClick={() => alert("Synthetic prototype — vendor onboarding simulated.")}>+ Onboard vendor</button>
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
                  <th>Name</th>
                  <th>Service</th>
                  <th>Categories</th>
                  <th>Locations</th>
                  <th>Contract</th>
                  <th>DPA</th>
                  <th>AI usage</th>
                  <th>Issues</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} onClick={() => setSelectedId(v.id)} style={{ cursor: "pointer", background: v.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                    <td className="mono">{v.id}</td>
                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                    <td style={{ fontSize: 12 }}>{v.serviceType}</td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {v.dataCategories.slice(0, 2).map((c) => <span key={c} className="tag">{c}</span>)}
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{v.processingLocations.join(", ")}</td>
                    <td><Pill status={v.contractStatus} variant={v.contractStatus === "Active" ? "mint" : "amber"} /></td>
                    <td><Pill status={v.dpaStatus} variant={v.dpaStatus === "Executed" ? "mint" : "amber"} /></td>
                    <td>{v.aiUsage ? <Pill status="Yes" variant="petrol" /> : <Pill status="No" variant="slate" />}</td>
                    <td>{v.openIssues > 0 ? <Pill status={String(v.openIssues) + " open"} variant="amber" /> : <Pill status="None" variant="mint" />}</td>
                    <td className="mono">{formatDate(v.reviewDate)}</td>
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
              <h3 style={{ fontSize: 16, marginTop: 2 }}>{selected.name}</h3>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <Pill status={selected.contractStatus} variant={selected.contractStatus === "Active" ? "mint" : "amber"} />
                <Pill status={selected.dpaStatus} variant={selected.dpaStatus === "Executed" ? "mint" : "amber"} />
                {selected.aiUsage && <Pill status="AI" variant="petrol" />}
              </div>
            </div>
            <div style={{ padding: 18, overflowY: "auto", maxHeight: "calc(100vh - 380px)" }}>
              <Field label="Service type">{selected.serviceType}</Field>
              <Field label="Data categories">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {selected.dataCategories.map((c) => <span key={c} className="tag">{c}</span>)}
                </div>
              </Field>
              <Field label="Processing locations">{selected.processingLocations.join(", ")}</Field>
              <Field label="Subprocessors">
                {selected.subProcessors.length === 0 ? "—" : selected.subProcessors.join(", ")}
              </Field>
              <Field label="Transfer assessment">{selected.transferAssessment}</Field>
              <Field label="Security review"><Pill status={selected.securityReview} /></Field>
              <Field label="Privacy review"><Pill status={selected.privacyReview} /></Field>
              <Field label="Open issues">{selected.openIssues}</Field>
              <Field label="Last reviewed">{formatDate(selected.reviewDate)}</Field>

              {linkedAssets.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Connected assets</h4>
                  {linkedAssets.map((a) => (
                    <Link key={a.id} href={`/assets?focus=${a.id}`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
                      <span className="mono">{a.id}</span> · {a.name}
                    </Link>
                  ))}
                </div>
              )}
              {linkedFlows.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Linked flows</h4>
                  {linkedFlows.map((f) => (
                    <Link key={f.id} href={`/flows?focus=${f.id}`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
                      <span className="mono">{f.id}</span> · {f.name}
                    </Link>
                  ))}
                </div>
              )}
              {linkedEvidence.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Evidence</h4>
                  {linkedEvidence.map((e) => (
                    <Link key={e.id} href={`/evidence?focus=${e.id}`} className="btn btn-ghost btn-sm" style={{ marginTop: 4, justifyContent: "flex-start" }}>
                      <span className="mono">{e.id}</span> · {e.title}
                    </Link>
                  ))}
                </div>
              )}
              <div className="banner" style={{ marginTop: 14 }}>
                Synthetic vendor records are used for demonstration only. No real vendor claims are made.
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