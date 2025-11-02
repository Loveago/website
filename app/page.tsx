import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostList, { type HomePost } from "@/components/home/PostList";

const PAGE_SIZE = 5;

export default async function Home({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, Number(searchParams?.page ?? 1) || 1);
  const [total, posts] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { author: { select: { name: true } } },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const viewPosts: HomePost[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    authorName: p.author?.name ?? null,
    createdAtISO: p.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent dark:from-indigo-400 dark:to-purple-400">Latest Posts</h1>
        <p className="text-sm text-muted-foreground">Read the freshest content from our community</p>
      </div>

      <PostList posts={viewPosts} />

      <div className="flex items-center justify-between">
        <Link
          href={{ pathname: "/", query: { page: String(Math.max(1, page - 1)) } }}
          className="inline-flex items-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 aria-disabled:opacity-50 aria-disabled:pointer-events-none"
          aria-disabled={page <= 1}
        >
          Previous
        </Link>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <Link
          href={{ pathname: "/", query: { page: String(Math.min(totalPages, page + 1)) } }}
          className="inline-flex items-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 aria-disabled:opacity-50 aria-disabled:pointer-events-none"
          aria-disabled={page >= totalPages}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
