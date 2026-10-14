"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Pill, Dot, formatDate, statusVariant } from "@/components/Pill";
import { useDemoState, mergedAsset } from "@/lib/store";
import type { Asset, Processing, AISystem, DataFlow, BU } from "@/lib/types";

const CLASSIFICATIONS = ["Public", "Internal", "Confidential", "Restricted", "Highly Sensitive"];
const ASSET_TYPES = [
  "Database", "File Share", "Cloud Storage Bucket", "SaaS Application",
  "Data Warehouse", "CRM", "Document Repository", "Endpoint Collection",
  "AI Knowledge Base", "Backup Repository", "API or Data Service"
];

export function AssetsView({
  assets,
  processingActivities,
  aiSystems,
  flows,
  businessUnits,
}: {
  assets: Asset[];
  processingActivities: Processing[];
  aiSystems: AISystem[];
  flows: DataFlow[];
  businessUnits: BU[];
}) {
  const { state, hydrated, patchAsset, recordReview, reset } = useDemoState();
  const [q, setQ] = useState("");
  const [unit, setUnit] = useState("all");
  const [type, setType] = useState("all");
  const [classification, setClassification] = useState("all");
  const [personalOnly, setPersonalOnly] = useState(false);
  const [specialOnly, setSpecialOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(assets[0]?.id ?? null);

  const merged = useMemo(() => assets.map((a) => mergedAsset(a, state)), [assets, state]);

  const filtered = useMemo(() => {
    return merged.filter((a) => {
      if (q) {
        const ql = q.toLowerCase();
        if (!a.name.toLowerCase().includes(ql) && !a.id.toLowerCase().includes(ql) && !a.owner.toLowerCase().includes(ql)) return false;
      }
      if (unit !== "all" && a.unitId !== unit) return false;
      if (type !== "all" && a.type !== type) return false;
      if (classification !== "all" && a.classification !== classification) return false;
      if (personalOnly && !a.containsPersonal) return false;
      if (specialOnly && !a.containsSpecialCategory) return false;
      return true;
    });
  }, [merged, q, unit, type, classification, personalOnly, specialOnly]);

  const selected = merged.find((a) => a.id === selectedId);
  const relatedProc = processingActivities.filter((p) => selected && p.sourceAssetIds.includes(selected.id));
  const relatedAI = aiSystems.filter((a) => selected && a.connectedAssets.includes(selected.id));
  const relatedFlows = flows.filter((f) => f.sourceAssetId === selectedId || f.destinationAssetId === selectedId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24 }}>Asset Register</h2>
          <p style={{ fontSize: 13, color: "var(--mw-text-muted)", marginTop: 4 }}>
            Canonical register of data and information assets. {filtered.length} of {merged.length} assets shown.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm("Reset all demo changes?")) reset(); }}>Reset demo</button>
          <button className="btn btn-primary btn-sm" onClick={() => alert("Synthetic prototype — create-asset flow simulated.")}>+ Register asset</button>
        </div>
      </div>

      {/* Filters */}
      <section className="praig-card" style={{ padding: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 240px", minWidth: 200 }}>
            <label>Search</label>
            <input className="input" placeholder="Search by name, ID, owner..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div>
            <label>Business unit</label>
            <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: 180 }}>
              <option value="all">All units</option>
              {businessUnits.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label>Asset type</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)} style={{ width: 180 }}>
              <option value="all">All types</option>
              {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label>Classification</label>
            <select className="input" value={classification} onChange={(e) => setClassification(e.target.value)} style={{ width: 180 }}>
              <option value="all">All</option>
              {CLASSIFICATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "0 6px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 0 }}>
              <input type="checkbox" checked={personalOnly} onChange={(e) => setPersonalOnly(e.target.checked)} />
              <span style={{ fontSize: 12 }}>Personal data</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 0 }}>
              <input type="checkbox" checked={specialOnly} onChange={(e) => setSpecialOnly(e.target.checked)} />
              <span style={{ fontSize: 12 }}>Special category</span>
            </label>
          </div>
        </div>
      </section>

      {/* Table + Detail */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "minmax(0, 1.4fr) minmax(0, 1fr)" : "1fr", gap: 16 }}>
        <section className="praig-card" style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto", maxHeight: "calc(100vh - 360px)" }}>
            <table className="praig-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Owner</th>
                  <th>Repository</th>
                  <th>Classification</th>
                  <th>Data</th>
                  <th>Risk</th>
                  <th>Last reviewed</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} onClick={() => setSelectedId(a.id)} style={{ cursor: "pointer", background: a.id === selectedId ? "rgba(0, 201, 167, 0.06)" : undefined }}>
                    <td className="mono">{a.id}</td>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td>{a.type}</td>
                    <td>{a.owner}</td>
                    <td style={{ fontSize: 12 }}>{a.repository}</td>
                    <td><Pill status={a.classification} variant={a.classification.includes("Sensitive") ? "coral" : a.classification === "Confidential" ? "amber" : "mint"} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        {a.containsPersonal && <span className="tag">P</span>}
                        {a.containsSpecialCategory && <span className="tag" style={{ background: "rgba(239,68,68,0.10)", color: "#991B1B", borderColor: "rgba(239,68,68,0.30)" }}>SC</span>}
                      </div>
                    </td>
                    <td><Pill status={a.riskLevel} variant={a.riskLevel === "Critical" ? "coral" : a.riskLevel === "High" ? "coral" : a.riskLevel === "Medium" ? "amber" : "mint"} /></td>
                    <td className="mono" style={{ whiteSpace: "nowrap" }}>{formatDate(a.lastReviewed)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="empty-state">No assets match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selected && (
          <AssetDetail
            asset={selected}
            relatedProc={relatedProc}
            relatedAI={relatedAI}
            relatedFlows={relatedFlows}
            businessUnit={businessUnits.find((b) => b.id === selected.unitId)}
            onClose={() => setSelectedId(null)}
            onEdit={(patch) => patchAsset(selected.id, patch)}
            onReview={(note) => recordReview(selected.id, note)}
          />
        )}
      </div>
    </div>
  );
}

function AssetDetail({
  asset, relatedProc, relatedAI, relatedFlows, businessUnit, onClose, onEdit, onReview,
}: {
  asset: Asset;
  relatedProc: Processing[];
  relatedAI: AISystem[];
  relatedFlows: DataFlow[];
  businessUnit?: BU;
  onClose: () => void;
  onEdit: (patch: Record<string, unknown>) => void;
  onReview: (note: string) => void;
}) {
  const [tab, setTab] = useState<"overview" | "classification" | "ownership" | "flows" | "ai" | "retention" | "review">("overview");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [reviewNote, setReviewNote] = useState("");

  const fields: Array<[string, string]> = [
    ["Asset name", asset.name],
    ["Asset type", asset.type],
    ["Repository", asset.repository],
    ["Owner", asset.owner],
    ["Custodian", asset.custodian ?? "—"],
    ["Business unit", businessUnit?.name ?? asset.unitId],
    ["Domain", asset.domain],
    ["Classification", asset.classification],
    ["Retention rule", asset.retentionRule ?? "—"],
  ];

  const answers: Array<[string, string]> = [
    ["What is this asset?", `${asset.type} holding ${asset.domain.toLowerCase()} data, located at ${asset.repository}.`],
    ["Who owns it?", `${asset.owner}${asset.custodian ? ` (custodian: ${asset.custodian})` : ""}.`],
    ["Where does it reside?", asset.repository],
    ["What data does it contain?", `${asset.containsPersonal ? "Personal data" : "Non-personal data"}${asset.containsSpecialCategory ? " plus special-category data" : ""}.`],
    ["Why is it used?", asset.description.slice(0, 140) + (asset.description.length > 140 ? "…" : "")],
    ["Who or what can access it?", "Access governed by RBAC; see control CTRL-0012 for review evidence."],
    ["Where does the data go?", relatedFlows.length ? `${relatedFlows.length} related flow(s).` : "No outbound flows recorded."],
    ["Is it used by an AI system?", relatedAI.length ? `Yes — ${relatedAI.map((a) => a.name).join(", ")}.` : "No."],
    ["What obligations and controls apply?", `${relatedProc.length} processing activities linked; see Policies & Controls.`],
    ["What needs attention?", asset.reviewStatus === "Awaiting Review" ? "Confirm classification and assign retention owner." : "Up to date."],
  ];

  return (
    <aside className="drawer" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--mw-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{asset.id}</div>
          <h3 style={{ fontSize: 16, marginTop: 2 }}>{asset.name}</h3>
        </div>
        <button onClick={onClose} aria-label="Close" className="btn btn-ghost btn-sm">✕</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--mw-border)", paddingLeft: 12, gap: 4 }}>
        {([
          ["overview", "Overview"],
          ["classification", "Classification"],
          ["ownership", "Ownership"],
          ["flows", "Data flows"],
          ["ai", "AI usage"],
          ["retention", "Retention"],
          ["review", "Review"],
        ] as const).map(([key, label]) => (
          <button key={key} className={`tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      <div style={{ padding: 18, overflowY: "auto", maxHeight: "calc(100vh - 380px)" }}>
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Pill status={asset.classification} />
              <Pill status={asset.riskLevel + " risk"} variant={asset.riskLevel === "Critical" || asset.riskLevel === "High" ? "coral" : asset.riskLevel === "Medium" ? "amber" : "mint"} />
              <Pill status={asset.reviewStatus} />
              <Pill status={"Last reviewed " + formatDate(asset.lastReviewed)} variant="seafoam" />
            </div>
            <div className="banner">{asset.description}</div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>At-a-glance answers</h4>
              <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 10, columnGap: 14 }}>
                {answers.map(([q, a]) => (
                  <div key={q} style={{ display: "contents" }}>
                    <dt style={{ fontSize: 12, fontWeight: 600, color: "var(--mw-text-muted)" }}>{q}</dt>
                    <dd style={{ fontSize: 12.5, margin: 0 }}>{a}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>Edit metadata</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setTab("review")}>Record review</button>
            </div>
          </div>
        )}

        {tab === "classification" && (
          <div>
            <p style={{ fontSize: 12, color: "var(--mw-text-muted)" }}>Classification reflects the highest sensitivity of the data this asset holds. Proposed classifications from discovery remain separate until confirmed.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {editing ? (
                <>
                  <div>
                    <label>Classification</label>
                    <select className="input" value={draft.classification ?? asset.classification} onChange={(e) => setDraft({ ...draft, classification: e.target.value })}>
                      {CLASSIFICATIONS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => { onEdit(draft); setEditing(false); setDraft({}); }}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(false); setDraft({}); }}>Cancel</button>
                  </div>
                </>
              ) : (
                <Field label="Classification"><Pill status={asset.classification} /></Field>
              )}
              <Field label="Contains personal data"><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Dot status={asset.containsPersonal ? "Yes" : "No"} variant={asset.containsPersonal ? "mint" : "slate"} />{asset.containsPersonal ? "Yes" : "No"}</span></Field>
              <Field label="Contains special-category data"><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Dot status={asset.containsSpecialCategory ? "Yes" : "No"} variant={asset.containsSpecialCategory ? "coral" : "slate"} />{asset.containsSpecialCategory ? "Yes" : "No"}</span></Field>
              <Field label="Review status"><Pill status={asset.reviewStatus} /></Field>
            </div>
          </div>
        )}

        {tab === "ownership" && (
          <div>
            <Field label="Owner">{asset.owner}</Field>
            <Field label="Custodian">{asset.custodian ?? "—"}</Field>
            <Field label="Business unit">{businessUnit?.name ?? asset.unitId}</Field>
            <Field label="Domain">{asset.domain}</Field>
            <div style={{ marginTop: 14 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Linked records</h4>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
                {relatedProc.map((p) => (
                  <Link key={p.id} href={`/processing/${p.id}`} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>
                    <span className="mono">{p.id}</span> · {p.name}
                  </Link>
                ))}
                {relatedAI.map((a) => (
                  <Link key={a.id} href={`/ai-systems/${a.id}`} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>
                    <span className="mono">{a.id}</span> · {a.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "flows" && (
          <div>
            {relatedFlows.length === 0 ? <div className="empty-state">No flows registered for this asset.</div> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {relatedFlows.map((f) => (
                  <Link key={f.id} href={`/flows?focus=${f.id}`} className="praig-card hover-lift" style={{ padding: 12, textDecoration: "none", color: "inherit" }}>
                    <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{f.id} · {f.destinationType}</div>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>{f.businessPurpose}</div>
                    <div style={{ marginTop: 6 }}><Pill status={f.approvalStatus} /></div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "ai" && (
          <div>
            {relatedAI.length === 0 ? <div className="empty-state">No AI systems connected to this asset.</div> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {relatedAI.map((a) => (
                  <Link key={a.id} href={`/ai-systems/${a.id}`} className="praig-card hover-lift" style={{ padding: 12, textDecoration: "none", color: "inherit" }}>
                    <div className="mono" style={{ fontSize: 11, color: "var(--mw-text-muted)" }}>{a.id} · {a.modelProvider}</div>
                    <div style={{ fontWeight: 600, marginTop: 2 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>{a.businessPurpose}</div>
                    <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                      <Pill status={a.approvalStatus} />
                      <Pill status={a.riskTier + " tier"} variant={a.riskTier === "Critical" || a.riskTier === "High" ? "coral" : a.riskTier === "Medium" ? "amber" : "mint"} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "retention" && (
          <div>
            <Field label="Retention rule">{asset.retentionRule ?? "—"}</Field>
            <Field label="Last reviewed">{formatDate(asset.lastReviewed)}</Field>
            <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 12 }}>
              Retention rules are enforced by automated jobs and reviewed by data governance. This rule is not a legal conclusion.
            </p>
          </div>
        )}

        {tab === "review" && (
          <div>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Record review</h4>
            <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 6 }}>Captures the review decision and reasoning for the audit timeline. Synthetic entries only.</p>
            <textarea className="input" placeholder="Review notes..." value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} style={{ marginTop: 8 }} />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={() => { if (reviewNote) { onReview(reviewNote); setReviewNote(""); alert("Review recorded (synthetic)."); } }}>Save review</button>
              <button className="btn btn-ghost btn-sm" onClick={() => { onEdit({ lastReviewed: new Date().toISOString() }); alert("Last reviewed updated to today."); }}>Mark reviewed today</button>
            </div>
            <div style={{ marginTop: 14 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Asset metadata</h4>
              <dl style={{ marginTop: 8, display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 6 }}>
                {fields.map(([k, v]) => (
                  <div key={k} style={{ display: "contents" }}>
                    <dt style={{ fontSize: 12, color: "var(--mw-text-muted)" }}>{k}</dt>
                    <dd style={{ fontSize: 12.5, margin: 0 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
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