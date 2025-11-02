import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const slug = params.username;

  let user = await prisma.user.findUnique({
    where: { username: slug },
    include: {
      _count: { select: { posts: true, comments: true } },
      posts: { where: { published: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { id: slug },
      include: {
        _count: { select: { posts: true, comments: true } },
        posts: { where: { published: true }, orderBy: { createdAt: "desc" } },
      },
    }) as any;
  }

  if (!user) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.image ?? "/avatar.png"} alt={user.name ?? user.username ?? "User"} className="h-24 w-24 rounded-full object-cover" />
        <div>
          <h1 className="text-2xl font-semibold">{user.name ?? user.username}</h1>
          {user.username && <div className="text-sm text-muted-foreground">@{user.username}</div>}
          {user.bio && <p className="mt-2 text-sm text-muted-foreground max-w-prose">{user.bio}</p>}
          <div className="mt-2 flex gap-4 text-sm">
            <span><strong>{user._count.posts}</strong> posts</span>
            <span><strong>{user._count.comments}</strong> comments</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Published Posts</h2>
        {user.posts.map((p: any) => (
          <div key={p.id} className="rounded-xl border p-3">
            <Link href={{ pathname: "/posts/[id]", query: { id: p.id } }} className="font-medium hover:underline">{p.title}</Link>
            <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.content.replace(/<[^>]+>/g, "")}</p>
          </div>
        ))}
        {!user.posts.length && <div className="text-sm text-muted-foreground">No published posts yet.</div>}
      </div>
    </div>
  );
}
