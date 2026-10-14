import { getDataEgressEvents, getAssets, getAISystems } from "@/lib/data";
import { ProtectionView } from "./ProtectionView";

export const dynamic = "force-dynamic";

export default async function ProtectionPage() {
  const [events, assets, ai] = await Promise.all([
    getDataEgressEvents("ORG-APX"),
    getAssets("ORG-APX"),
    getAISystems("ORG-APX"),
  ]);
  return <ProtectionView events={events} assets={assets} aiSystems={ai} />;
}