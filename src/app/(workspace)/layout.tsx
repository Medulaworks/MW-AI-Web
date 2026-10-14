import { AppShell } from "@/components/AppShell";
import { getOrganisations } from "@/lib/data";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const orgs = await getOrganisations();
  // Synthetic demo uses Apex Bank as default
  const activeOrg = orgs.find((o) => o.id === "ORG-APX") ?? orgs[0];
  return (
    <AppShell orgName={activeOrg.name}>
      {children}
    </AppShell>
  );
}