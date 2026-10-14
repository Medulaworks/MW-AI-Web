import { getIncidents, getExceptions, getAssets, getEvidence } from "@/lib/data";
import { IncidentsView } from "./IncidentsView";

export const dynamic = "force-dynamic";

export default async function IncidentsPage() {
  const [incidents, exceptions, assets, evidence] = await Promise.all([
    getIncidents("ORG-APX"),
    getExceptions("ORG-APX"),
    getAssets("ORG-APX"),
    getEvidence("ORG-APX"),
  ]);
  return <IncidentsView incidents={incidents} exceptions={exceptions} assets={assets} evidence={evidence} />;
}