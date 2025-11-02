"use client";

import Link from "next/link";
import FadeIn from "@/components/animated/FadeIn";
import { CalendarDays, User2 } from "lucide-react";

export type HomePost = {
  id: string;
  title: string;
  content: string;
  authorName: string | null;
  createdAtISO: string;
};

export default function PostList({ posts }: { posts: HomePost[] }) {
  return (
    <div className="space-y-4">
      {posts.map((p, idx) => (
        <FadeIn key={p.id} delay={idx * 0.04}>
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-teal-500/20 p-[1px] hover:shadow-lg transition-shadow">
            <div className="rounded-2xl border bg-card p-4">
              <Link href={{ pathname: "/posts/[id]", params: { id: p.id } }} className="text-xl font-semibold hover:underline">
                {p.title}
              </Link>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><User2 className="h-4 w-4" />{p.authorName ?? "Unknown"}</span>
                <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" />{new Date(p.createdAtISO).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.content}</p>
            </div>
          </div>
        </FadeIn>
      ))}
      {posts.length === 0 && <div className="text-muted-foreground">No posts yet.</div>}
    </div>
  );
}
