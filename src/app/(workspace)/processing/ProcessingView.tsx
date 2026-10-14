"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, formatDate } from "@/components/Pill";
import type { Processing, Asset, DataFlow, Vendor, Assessment } from "@/lib/types";

export function ProcessingView({
  activities, assets, flows, vendors, assessments,
}: {
  activities: Processing[];
  assets: Asset[];
  flows: DataFlow[];
  vendors: Vendor[];
  assessments: Assessment[];
}) {
  const [q, setQ] = useState("");
  const [unit, setUnit] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(activities[0]?.id ?? null);

  const filtered = useMemo(() => activities.filter((p) => {
    if (q) {
      const ql = q.toLowerCase();
      if (!p.name.toLowerCase().includes(ql) && !p.id.toLowerCase().includes(ql) && !p.controller.toLowerCase().includes(ql)) return false;
    }
    if (unit !== "all" && p.unitId !== unit) return false;
    return true;
  }), [activities, q, unit]);

  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0];
  const linkedAssets = selected ? selected.sourceAssetIds.map((id) => assets.find((a) => a.id === id)).filter(Boolean) as Asset[] : [];
  const linkedVendors = selected ? selected.processors.map((id) => vendors.find((v) => v.id === id)).filter(Boolean) as Vendor[] : [];
  const linkedAssessment = selected?.riskAssessmentId ? assessments.find((a) => a.id === selected.riskAssessmentId) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 24 }}>Processing Activities</h2>
        <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
          Records of processing activities maintained for privacy governance. Jurisdiction-aware lawful-basis fields.
        </p>
      </div>

      <section className="praig-card" style={{ padding: 14 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px" }}>
            <label>Search</label>
            <input className="input" placeholder="Search activities..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <label>Unit</label>
            <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: 200 }}>
              <option value="all">All units</option>
              {[...new Set(activities.map((a) => a.unitId))].map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <button className="btn btn-primary btn-sm" onClick={() => alert("Synthetic prototype — activity creation simulated.")}>+ Create activity</button>
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
                  <th>Activity</th>
                  <th>Purpose</th>
                  <th>Controller</th>
                  <th>Categories</th>
                  <th>Lawful basis</th>
                  <th>Cross-border</th>
                  <th>Last reviewed</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} onClick={() => setSelectedId(p.id)} style={{ cursor: "pointer", background: p.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                    <td className="mono">{p.id}</td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ fontSize: 12 }}>{p.businessPurpose}</td>
                    <td>{p.controller}</td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {p.dataCategories.slice(0, 2).map((c) => <span key={c} className="tag">{c}</span>)}
                        {p.dataCategories.length > 2 && <span className="tag">+{p.dataCategories.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{p.lawfulBasis}</td>
                    <td>{p.crossBorderTransfer ? <Pill status="Yes" variant="amber" /> : <Pill status="No" variant="mint" />}</td>
                    <td className="mono">{formatDate(p.lastReviewed)}</td>
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
              <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>{selected.businessPurpose}</p>
            </div>
            <div style={{ padding: 18, overflowY: "auto", maxHeight: "calc(100vh - 380px)" }}>
              <Field label="Controller">{selected.controller}</Field>
              <Field label="Business unit">{selected.unitId}</Field>
              <Field label="Categories of individuals">{selected.categoriesOfIndividuals.join(", ")}</Field>
              <Field label="Data categories">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {selected.dataCategories.map((c) => <span key={c} className="tag">{c}</span>)}
                </div>
              </Field>
              <Field label="Jurisdictions">{selected.jurisdictions.join(", ")}</Field>
              <Field label="Lawful basis">{selected.lawfulBasis}</Field>
              <Field label="Cross-border transfer">{selected.crossBorderTransfer ? "Yes" : "No"}</Field>
              <Field label="Retention rule">{selected.retentionRule}</Field>
              <Field label="Recipients">{selected.recipients.join(", ")}</Field>
              <Field label="Processors">
                {linkedVendors.length === 0 ? "—" : linkedVendors.map((v) => <Link key={v.id} href={`/vendors?focus=${v.id}`}>{v.name}</Link>)}
              </Field>
              <Field label="Owner">{selected.owner}</Field>
              <Field label="Last reviewed">{formatDate(selected.lastReviewed)}</Field>

              {linkedAssets.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Linked assets</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {linkedAssets.map((a) => (
                      <Link key={a.id} href={`/assets?focus=${a.id}`} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>
                        <span className="mono">{a.id}</span> · {a.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {linkedAssessment && (
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Linked assessment</h4>
                  <Link href={`/assessments?focus=${linkedAssessment.id}`} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>
                    <span className="mono">{linkedAssessment.id}</span> · {linkedAssessment.type}
                  </Link>
                </div>
              )}
              <div className="banner" style={{ marginTop: 14 }}>
                A populated processing record is not a legal conclusion. Verify with the relevant privacy office.
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