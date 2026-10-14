import { getOrganisations, getBusinessUnits } from "@/lib/data";
import { SettingsView } from "./SettingsView";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [orgs, bus] = await Promise.all([getOrganisations(), getBusinessUnits()]);
  return <SettingsView orgs={orgs} businessUnits={bus} />;
}