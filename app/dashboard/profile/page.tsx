import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard/profile");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Profile Settings</h1>
      <ProfileForm />
    </div>
  );
}
