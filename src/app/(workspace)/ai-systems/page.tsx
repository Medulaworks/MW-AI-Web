import { getAISystems, getAssets, getVendors, getDataFlows } from "@/lib/data";
import { AISystemsView } from "./AISystemsView";

export const dynamic = "force-dynamic";

export default async function AISystemsPage({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const sp = await searchParams;
  const [ai, assets, vendors, flows] = await Promise.all([
    getAISystems("ORG-APX"),
    getAssets("ORG-APX"),
    getVendors("ORG-APX"),
    getDataFlows("ORG-APX"),
  ]);
  return <AISystemsView aiSystems={ai} assets={assets} vendors={vendors} flows={flows} focus={sp.focus} />;
}