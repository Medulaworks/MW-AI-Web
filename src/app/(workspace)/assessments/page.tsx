import { getAssessments, getControls, getAssets, getProcessingActivities, getAISystems } from "@/lib/data";
import { AssessmentsView } from "./AssessmentsView";

export const dynamic = "force-dynamic";

export default async function AssessmentsPage({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const sp = await searchParams;
  const [assessments, controls, assets, proc, ai] = await Promise.all([
    getAssessments("ORG-APX"),
    getControls("ORG-APX"),
    getAssets("ORG-APX"),
    getProcessingActivities("ORG-APX"),
    getAISystems("ORG-APX"),
  ]);
  return <AssessmentsView assessments={assessments} controls={controls} assets={assets} processing={proc} ai={ai} focus={sp.focus} />;
}