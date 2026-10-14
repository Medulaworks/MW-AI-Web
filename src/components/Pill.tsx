// Shared status pill helper - returns semantic variant
export function statusVariant(status: string): "mint" | "amber" | "coral" | "slate" | "seafoam" | "petrol" {
  const s = status.toLowerCase();
  if (s.includes("approved") && !s.includes("conditional")) return "mint";
  if (s.includes("conditional") || s.includes("under review") || s.includes("in review") || s.includes("in progress") || s.includes("pending")) return "amber";
  if (s.includes("blocked") || s.includes("rejected") || s.includes("overdue") || s.includes("critical") || s.includes("contained")) return "coral";
  if (s.includes("confirmed") || s.includes("complete") || s.includes("completed") || s.includes("current") || s.includes("logged") || s.includes("active")) return "mint";
  if (s.includes("restricted") || s.includes("draft")) return "seafoam";
  if (s.includes("proposed") || s.includes("awaiting")) return "amber";
  if (s.includes("retired") || s.includes("mitigated")) return "petrol";
  return "slate";
}

export function riskVariant(level: string): "mint" | "amber" | "coral" | "slate" {
  const l = level.toLowerCase();
  if (l === "critical" || l === "high") return "coral";
  if (l === "medium") return "amber";
  if (l === "low") return "mint";
  return "slate";
}

export function Pill({ status, variant }: { status: string; variant?: "mint" | "amber" | "coral" | "slate" | "seafoam" | "petrol" }) {
  const v = variant ?? statusVariant(status);
  return <span className={`pill pill-${v}`}>{status}</span>;
}

export function Dot({ status, variant }: { status: string; variant?: "mint" | "amber" | "coral" | "slate" | "seafoam" | "petrol" }) {
  const v = variant ?? statusVariant(status);
  return <span className={`status-dot dot-${v}`} title={status} aria-label={status} />;
}

export function formatDate(d?: string | Date | null) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return date.toISOString().slice(0, 10);
}

export function formatDateTime(d?: string | Date | null) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return date.toISOString().replace("T", " ").slice(0, 16);
}