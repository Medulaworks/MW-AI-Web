import Link from "next/link";
import { getAssets, getProcessingActivities, getAISystems, getDataFlows, getBusinessUnits } from "@/lib/data";
import { AssetsView } from "./AssetsView";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const [assets, proc, ai, flows, bus] = await Promise.all([
    getAssets("ORG-APX"),
    getProcessingActivities("ORG-APX"),
    getAISystems("ORG-APX"),
    getDataFlows("ORG-APX"),
    getBusinessUnits(),
  ]);
  return (
    <AssetsView
      assets={assets}
      processingActivities={proc}
      aiSystems={ai}
      flows={flows}
      businessUnits={bus.filter((b) => b.orgId === "ORG-APX")}
    />
  );
}