import { getProcessingActivities, getAssets, getDataFlows, getVendors, getAssessments } from "@/lib/data";
import { ProcessingView } from "./ProcessingView";

export const dynamic = "force-dynamic";

export default async function ProcessingPage() {
  const [proc, assets, flows, vendors, assessments] = await Promise.all([
    getProcessingActivities("ORG-APX"),
    getAssets("ORG-APX"),
    getDataFlows("ORG-APX"),
    getVendors("ORG-APX"),
    getAssessments("ORG-APX"),
  ]);
  return (
    <ProcessingView
      activities={proc}
      assets={assets}
      flows={flows}
      vendors={vendors}
      assessments={assessments}
    />
  );
}