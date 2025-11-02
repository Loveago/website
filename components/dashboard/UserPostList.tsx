"use client";

import Link from "next/link";
import FadeIn from "@/components/animated/FadeIn";

export type UserPost = {
  id: string;
  title: string;
  content: string;
  createdAtISO: string;
};

export default function UserPostList({ posts }: { posts: UserPost[] }) {
  return (
    <div className="space-y-3">
      {posts.map((p, idx) => (
        <FadeIn key={p.id} delay={idx * 0.03}>
          <div className="rounded-2xl border p-3 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <Link href={{ pathname: "/posts/[id]", params: { id: p.id } }} className="font-semibold hover:underline">{p.title}</Link>
              <form action={`/api/posts/${p.id}`} method="post" onSubmit={(e) => { if (!confirm("Delete this post?")) e.preventDefault(); }}>
                <input type="hidden" name="_method" value="delete" />
                <button className="text-sm text-destructive underline" formAction={`/api/posts/${p.id}`}>
                  Delete
                </button>
              </form>
            </div>
            <div className="text-sm text-muted-foreground">{new Date(p.createdAtISO).toLocaleString()}</div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.content}</p>
          </div>
        </FadeIn>
      ))}
      {posts.length === 0 && <div className="text-muted-foreground">No posts yet. Create your first one above.</div>}
    </div>
  );
}
