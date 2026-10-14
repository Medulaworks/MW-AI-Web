"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDate, statusVariant } from "@/components/Pill";
import type { AISystem, Asset, Vendor, DataFlow } from "@/lib/types";

const APPROVAL_STATES = ["Proposed", "Under Assessment", "Approved with Conditions", "Approved", "Restricted", "Rejected", "Retired"];

export function AISystemsView({
  aiSystems, assets, vendors, flows, focus,
}: {
  aiSystems: AISystem[];
  assets: Asset[];
  vendors: Vendor[];
  flows: DataFlow[];
  focus?: string;
}) {
  const [q, setQ] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(focus ?? aiSystems[0]?.id ?? null);

  const filtered = useMemo(() => aiSystems.filter((i) => {
    if (q) {
      const ql = q.toLowerCase();
      if (!i.name.toLowerCase().includes(ql) && !i.id.toLowerCase().includes(ql) && !i.businessPurpose.toLowerCase().includes(ql)) return false;
    }
    if (tierFilter !== "all" && i.riskTier !== tierFilter) return false;
    if (statusFilter !== "all" && i.approvalStatus !== statusFilter) return false;
    return true;
  }), [aiSystems, q, tierFilter, statusFilter]);

  const selected = filtered.find((i) => i.id === selectedId) ?? filtered[0];
  const linkedAssets = selected ? selected.connectedAssets.map((id) => assets.find((a) => a.id === id)).filter(Boolean) as Asset[] : [];
  const linkedFlows = flows.filter((f) => f.aiSystemId === selectedId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>AI Systems & Models</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Inventory of AI systems, use cases, models, vendors and approval status.
        </p>
      </div>

      <section className="praig-card" style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px" }}>
            <label>Search</label>
            <input className="input" placeholder="Search AI systems..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <label>Risk tier</label>
            <select className="input" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} style={{ width: 160 }}>
              <option value="all">All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div>
            <label>Approval</label>
            <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 200 }}>
              <option value="all">All</option>
              {APPROVAL_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn btn-primary btn-sm" onClick={() => alert("Synthetic prototype — AI system creation simulated.")}>+ Register AI system</button>
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
                  <th>Purpose</th>
                  <th>Provider</th>
                  <th>Tier</th>
                  <th>External</th>
                  <th>Approval</th>
                  <th>Last review</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} onClick={() => setSelectedId(i.id)} style={{ cursor: "pointer", background: i.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                    <td className="mono">{i.id}</td>
                    <td style={{ fontWeight: 600 }}>{i.name}</td>
                    <td style={{ fontSize: 12 }}>{i.businessPurpose}</td>
                    <td style={{ fontSize: 12 }}>{i.modelProvider}</td>
                    <td><Pill status={i.riskTier} variant={i.riskTier === "Critical" || i.riskTier === "High" ? "coral" : i.riskTier === "Medium" ? "amber" : "mint"} /></td>
                    <td>{i.externalProcessing ? <Pill status="Yes" variant="petrol" /> : <Pill status="No" variant="mint" />}</td>
                    <td><Pill status={i.approvalStatus} /></td>
                    <td className="mono">{formatDate(i.lastReview)}</td>
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
                <Pill status={selected.approvalStatus} />
                <Pill status={selected.riskTier + " tier"} variant={selected.riskTier === "Critical" || selected.riskTier === "High" ? "coral" : selected.riskTier === "Medium" ? "amber" : "mint"} />
              </div>
            </div>
            <div style={{ padding: 18, overflowY: "auto", maxHeight: "calc(100vh - 380px)" }}>
              <div className="banner" style={{ marginBottom: 12 }}>{selected.description}</div>
              <Field label="Business purpose">{selected.businessPurpose}</Field>
              <Field label="Business owner">{selected.businessOwner}</Field>
              <Field label="Technical owner">{selected.technicalOwner}</Field>
              <Field label="Deployment">{selected.deployment}</Field>
              <Field label="Model / provider">{selected.modelProvider} — {selected.modelFamily}</Field>
              <Field label="Data classes">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {selected.dataClasses.map((c) => <span key={c} className="tag">{c}</span>)}
                </div>
              </Field>
              <Field label="External processing">{selected.externalProcessing ? "Yes — egress policy applied" : "No — internal only"}</Field>
              <Field label="Assessment status">{selected.assessmentStatus}</Field>
              <Field label="Approval conditions">{selected.approvalConditions ?? "—"}</Field>
              <Field label="Last review">{formatDate(selected.lastReview)}</Field>

              {linkedAssets.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Connected assets</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {linkedAssets.map((a) => (
                      <Link key={a.id} href={`/assets?focus=${a.id}`} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>
                        <span className="mono">{a.id}</span> · {a.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {linkedFlows.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Linked data flows</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {linkedFlows.map((f) => (
                      <Link key={f.id} href={`/flows?focus=${f.id}`} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>
                        <span className="mono">{f.id}</span> · {f.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="banner" style={{ marginTop: 14 }}>
                Approval does not automatically mean the system is safe or compliant. Display conditions and review evidence.
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