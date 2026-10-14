import { getAssets, getDataEgressEvents, getDataFlows, getProcessingActivities, getAISystems, getVendors, getAssessments, getControls, getIncidents } from "@/lib/data";
import { ReportsView } from "./ReportsView";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [assets, dlp, flows, proc, ai, vendors, assessments, controls, incidents] = await Promise.all([
    getAssets("ORG-APX"),
    getDataEgressEvents("ORG-APX"),
    getDataFlows("ORG-APX"),
    getProcessingActivities("ORG-APX"),
    getAISystems("ORG-APX"),
    getVendors("ORG-APX"),
    getAssessments("ORG-APX"),
    getControls("ORG-APX"),
    getIncidents("ORG-APX"),
  ]);
  return <ReportsView assets={assets} events={dlp} flows={flows} processing={proc} ai={ai} vendors={vendors} assessments={assessments} controls={controls} incidents={incidents} />;
}