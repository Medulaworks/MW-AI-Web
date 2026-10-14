import { getPrivacyRequests, getAssets, getSystems } from "@/lib/data";
import { RightsView } from "./RightsView";

export const dynamic = "force-dynamic";

export default async function RightsPage() {
  const [reqs, assets, systems] = await Promise.all([
    getPrivacyRequests("ORG-APX"),
    getAssets("ORG-APX"),
    getSystems("ORG-APX"),
  ]);
  return <RightsView requests={reqs} assets={assets} systems={systems} />;
}