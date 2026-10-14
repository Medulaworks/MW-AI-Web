import Link from "next/link";
import {
  getOverviewMetrics,
  getAssets,
  getAISystems,
  getProcessingActivities,
  getDataEgressEvents,
  getAssessments,
  getControls,
  getIncidents,
} from "@/lib/data";
import { Pill, Dot } from "@/components/Pill";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const m = await getOverviewMetrics("ORG-APX");
  const assets = await getAssets("ORG-APX");
  const ai = await getAISystems("ORG-APX");
  const proc = await getProcessingActivities("ORG-APX");
  const dlp = await getDataEgressEvents("ORG-APX");
  const ass = await getAssessments("ORG-APX");
  const ctrl = await getControls("ORG-APX");
  const inc = await getIncidents("ORG-APX");

  // Priority work rows
  const priorityWork = [
    {
      id: "PRW-0001",
      priority: "High",
      title: "Customer analytics dataset has no confirmed retention owner",
      related: { type: "Asset", id: "AST-0006", label: assets.find((a) => a.id === "AST-0006")?.name ?? "" },
      owner: "Anika Rao",
      due: "2026-02-12",
      status: "Awaiting Review",
      next: "Confirm retention owner",
      href: "/assets/AST-0006",
    },
    {
      id: "PRW-0002",
      priority: "High",
      title: "New AI use case requires an assessment",
      related: { type: "AI System", id: "AIS-0005", label: ai.find((x) => x.id === "AIS-0005")?.name ?? "" },
      owner: "Dr. Aisha Khan",
      due: "2026-02-20",
      status: "In Progress",
      next: "Complete assessment",
      href: "/ai-systems/AIS-0005",
    },
    {
      id: "PRW-0003",
      priority: "Medium",
      title: "Vendor data-sharing flow lacks current evidence",
      related: { type: "Data Flow", id: "FLOW-0009", label: "Behavioural Events to Approved Provider" },
      owner: "Carlos Mendes",
      due: "2026-02-08",
      status: "Under Review",
      next: "Refresh vendor evidence",
      href: "/flows",
    },
    {
      id: "PRW-0004",
      priority: "Medium",
      title: "Sensitive-data discovery result needs validation",
      related: { type: "Discovery", id: "DISC-0001", label: "Customer Voice Recordings Sample" },
      owner: "Unassigned",
      due: "2026-01-22",
      status: "New",
      next: "Assign reviewer",
      href: "/discovery",
    },
    {
      id: "PRW-0005",
      priority: "Medium",
      title: "Control review is overdue",
      related: { type: "Control", id: "CTRL-0011", label: "Asset Classification Review" },
      owner: "Data Governance",
      due: "2026-01-15",
      status: "Overdue",
      next: "Record test results",
      href: "/controls",
    },
    {
      id: "PRW-0006",
      priority: "High",
      title: "External AI request was blocked in the simulated gateway",
      related: { type: "DLP Event", id: "DLP-0003", label: "Blocked: Health Information" },
      owner: "Security Engineering",
      due: "2026-01-25",
      status: "Logged",
      next: "Review decision",
      href: "/protection",
    },
  ];

  // Coverage rows
  const coverageItems = [
    { name: "Asset Ownership", value: m.coverage.assetOwnership, denom: "Assets with an assigned owner" },
    { name: "Classification", value: m.coverage.classification, denom: "Assets with confirmed classification" },
    { name: "Processing Records", value: m.coverage.processingRecords, denom: "Activities reviewed in last 12 months" },
    { name: "Retention Assignments", value: m.coverage.retentionAssignments, denom: "Assets with retention rules" },
    { name: "AI-System Inventory", value: m.coverage.aiSystemInventory, denom: "AI systems reviewed in last 12 months" },
    { name: "Vendor Reviews", value: m.coverage.vendorReviews, denom: "Vendors with security & privacy review" },
    { name: "Risk Assessments", value: m.coverage.riskAssessments, denom: "Assessments marked Completed" },
    { name: "Control Evidence", value: m.coverage.controlEvidence, denom: "Evidence records marked Current" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Synthetic demo banner */}
      <div className="banner">
        <strong>Synthetic demo environment.</strong> All asset, vendor and incident data is synthetic and used for demonstration only. No real personal information is stored in this prototype.
      </div>

      {/* Compact metric row */}
      <section className="praig-card" style={{ padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 0 }}>
          <Metric label="Registered assets" value={m.totalAssets} sub={`${m.awaitingClassification} awaiting classification`} accent="petrol" />
          <Metric label="AI systems" value={ai.length} sub={`${m.aiAwaitingApproval} awaiting approval`} accent="mint" />
          <Metric label="Processing activities" value={proc.length} sub={`${m.processingUnderReview} due review`} accent="petrol" />
          <Metric label="High-risk assessments" value={m.highRiskAssessments} sub={`${ass.length} total assessments`} accent="coral" />
          <Metric label="Open incidents" value={m.openIncidents} sub={`${m.overdueEvidence} overdue evidence`} accent="amber" />
          <Metric label="Unreviewed egress" value={m.unreviewedEgress} sub={`${dlp.length} total events`} accent="amber" />
        </div>
      </section>

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 24 }} id="overview-priority">
        {/* Priority work */}
        <section className="praig-card">
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--mw-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 className="section-title">Priority work</h2>
              <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>
                Items requiring owner attention across assets, AI, vendors, controls and data-egress.
              </p>
            </div>
            <Link href="/reports" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="praig-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Action</th>
                  <th>Owner</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {priorityWork.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Pill status={p.priority} variant={p.priority === "High" ? "coral" : "amber"} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: "var(--mw-text-muted)", marginTop: 2 }}>
                        <span className="mono">{p.related.id}</span> · {p.related.label}
                      </div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{p.owner}</td>
                    <td style={{ whiteSpace: "nowrap" }} className="mono">{p.due}</td>
                    <td><Pill status={p.status} /></td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Link href={p.href} className="btn btn-ghost btn-sm">{p.next}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Governance coverage */}
        <section className="praig-card">
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--mw-border)" }}>
            <h2 className="section-title">Governance coverage</h2>
            <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>
              Indicators are populated from synthetic records. A populated inventory is not evidence of legal compliance.
            </p>
          </div>
          <div style={{ padding: 12 }}>
            {coverageItems.map((c) => (
              <div key={c.name} style={{ padding: "10px 6px", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }} className="mono">{c.value}%</div>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.value}%`, background: c.value < 60 ? "var(--mw-risk-warning)" : c.value < 40 ? "var(--mw-risk-critical)" : "var(--mw-primary)" }} /></div>
                <div style={{ fontSize: 10.5, color: "var(--mw-text-muted)", marginTop: 4 }}>{c.denom}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent activity */}
      <section className="praig-card">
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--mw-border)" }}>
          <h2 className="section-title">Recent activity</h2>
          <p style={{ fontSize: 12, color: "var(--mw-text-muted)", marginTop: 4 }}>
            Latest decisions, reviews and recorded events.
          </p>
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
            {[
              { actor: "Priya Mehta", action: "Classification confirmed", record: "AST-0001", when: "2026-01-09 10:14" },
              { actor: "Lara Bianchi", action: "Egress event reviewed", record: "DLP-0001", when: "2026-01-09 10:20" },
              { actor: "Dr. Aisha Khan", action: "AI system record updated", record: "AIS-0005", when: "2026-01-08 11:45" },
              { actor: "Carlos Mendes", action: "Exception approved", record: "EXC-0001", when: "2026-01-07 09:00" },
              { actor: "Tomas Bjorn", action: "Vendor assessment noted", record: "VND-0003", when: "2026-01-06 14:22" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 10, border: "1px solid #F1F5F9", borderRadius: 6 }}>
                <Dot status="Active" variant="mint" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{a.action}</div>
                  <div style={{ fontSize: 11, color: "var(--mw-text-muted)", marginTop: 2 }}>
                    <span className="mono">{a.record}</span> · {a.actor}
                  </div>
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--mw-text-muted)" }}>{a.when}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, sub, accent }: { label: string; value: number; sub: string; accent: "mint" | "petrol" | "coral" | "amber" }) {
  return (
    <div style={{ padding: "6px 14px", borderRight: "1px solid #F1F5F9" }}>
      <div style={{ fontSize: 11, color: "var(--mw-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--mw-text)" }}>{value}</span>
        <span className={`status-dot dot-${accent === "petrol" ? "petrol" : accent === "coral" ? "coral" : accent === "amber" ? "amber" : "mint"}`} />
      </div>
      <div style={{ fontSize: 11, color: "var(--mw-text-muted)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}