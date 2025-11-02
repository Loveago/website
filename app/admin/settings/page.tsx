import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findFirst();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Site Settings</h1>
      <SettingsForm initial={settings ?? null} />
    </div>
  );
}
