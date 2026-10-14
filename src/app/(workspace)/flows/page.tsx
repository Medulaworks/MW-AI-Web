import { getDataFlows, getAssets, getVendors, getAISystems, getSystems } from "@/lib/data";
import { FlowsView } from "./FlowsView";

export const dynamic = "force-dynamic";

export default async function FlowsPage({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const sp = await searchParams;
  const [flows, assets, vendors, ai, systems] = await Promise.all([
    getDataFlows("ORG-APX"),
    getAssets("ORG-APX"),
    getVendors("ORG-APX"),
    getAISystems("ORG-APX"),
    getSystems("ORG-APX"),
  ]);
  return (
    <FlowsView
      flows={flows}
      assets={assets}
      vendors={vendors}
      aiSystems={ai}
      systems={systems}
      focus={sp.focus}
    />
  );
}