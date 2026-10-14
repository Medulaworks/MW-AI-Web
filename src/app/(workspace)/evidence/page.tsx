import { getEvidence, getAuditEvents, getControls, getAssets } from "@/lib/data";
import { EvidenceView } from "./EvidenceView";

export const dynamic = "force-dynamic";

export default async function EvidencePage({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const sp = await searchParams;
  const [evidence, audit, controls, assets] = await Promise.all([
    getEvidence("ORG-APX"),
    getAuditEvents("ORG-APX"),
    getControls("ORG-APX"),
    getAssets("ORG-APX"),
  ]);
  return <EvidenceView evidence={evidence} audit={audit} controls={controls} assets={assets} focus={sp.focus} />;
}