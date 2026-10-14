import { getControls, getObligations, getPolicies, getEvidence, getAssets } from "@/lib/data";
import { ControlsView } from "./ControlsView";

export const dynamic = "force-dynamic";

export default async function ControlsPage({ searchParams }: { searchParams: Promise<{ focus?: string; tab?: string }> }) {
  const sp = await searchParams;
  const [controls, obligations, policies, evidence, assets] = await Promise.all([
    getControls("ORG-APX"),
    getObligations("ORG-APX"),
    getPolicies("ORG-APX"),
    getEvidence("ORG-APX"),
    getAssets("ORG-APX"),
  ]);
  return (
    <ControlsView
      controls={controls}
      obligations={obligations}
      policies={policies}
      evidence={evidence}
      assets={assets}
      focus={sp.focus}
      tab={sp.tab}
    />
  );
}