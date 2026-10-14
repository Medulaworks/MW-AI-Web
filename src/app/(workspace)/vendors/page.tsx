import { getVendors, getAssets, getSystems, getDataFlows, getEvidence } from "@/lib/data";
import { VendorsView } from "./VendorsView";

export const dynamic = "force-dynamic";

export default async function VendorsPage({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const sp = await searchParams;
  const [vendors, assets, systems, flows, ev] = await Promise.all([
    getVendors("ORG-APX"),
    getAssets("ORG-APX"),
    getSystems("ORG-APX"),
    getDataFlows("ORG-APX"),
    getEvidence("ORG-APX"),
  ]);
  return <VendorsView vendors={vendors} assets={assets} systems={systems} flows={flows} evidence={ev} focus={sp.focus} />;
}