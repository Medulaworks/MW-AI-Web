import { getDiscoveryItems, getAssets } from "@/lib/data";
import { DiscoveryView } from "./DiscoveryView";

export const dynamic = "force-dynamic";

export default async function DiscoveryPage() {
  const [items, assets] = await Promise.all([getDiscoveryItems("ORG-APX"), getAssets("ORG-APX")]);
  return <DiscoveryView items={items} assets={assets} />;
}