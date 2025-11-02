import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewPostForm from "./post-form";
import Fab from "@/components/fab";
import UserPostList, { type UserPost } from "@/components/dashboard/UserPostList";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/dashboard");

  const posts = await prisma.post.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const viewPosts: UserPost[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    createdAtISO: p.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent dark:from-indigo-400 dark:to-purple-400">Dashboard</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/dashboard" className="rounded-2xl border px-3 py-1.5 hover:bg-muted">My Posts</Link>
          <Link href="/dashboard/profile" className="rounded-2xl border px-3 py-1.5 hover:bg-muted">Profile Settings</Link>
        </div>
      </div>
      <div id="new-post">
        <NewPostForm />
      </div>
      <UserPostList posts={viewPosts} />
      <Fab />
    </div>
  );
}
