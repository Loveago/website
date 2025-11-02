import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminUsers from "./users";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") redirect("/");

  const [userCount, postCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-md border p-4"><div className="text-sm text-muted-foreground">Total Users</div><div className="text-2xl font-semibold">{userCount}</div></div>
        <div className="rounded-md border p-4"><div className="text-sm text-muted-foreground">Total Posts</div><div className="text-2xl font-semibold">{postCount}</div></div>
      </div>
      <AdminUsers />
    </div>
  );
}
