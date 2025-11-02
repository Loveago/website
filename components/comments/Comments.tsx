"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string | null; username: string | null; image: string | null };
};

export default function Comments({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const { data, mutate } = useSWR<{ comments: Comment[] }>(`/api/comments?postId=${postId}`, fetcher);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: text.trim() }),
    });
    setLoading(false);
    if (!res.ok) return;
    setText("");
    mutate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) mutate();
  }

  return (
    <div className="mt-8 space-y-4">
      {session && (
        <form onSubmit={submit} className="flex items-center gap-2">
          <Input
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" disabled={loading || !text.trim()}>
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {data?.comments?.map((c, idx) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="rounded-xl border bg-white/60 p-3 shadow-sm dark:bg-neutral-800/60">
            <div className="flex items-start gap-3">
              <Link href={`/user/${c.author.username ?? c.author.id}`} className="shrink-0">
                <Avatar src={c.author.image} className="h-10 w-10" />
              </Link>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link href={`/user/${c.author.username ?? c.author.id}`} className="font-medium hover:underline">
                      {c.author.name ?? c.author.username ?? "User"}
                    </Link>
                    <span className="ml-2 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  {(session?.user as any)?.role === "ADMIN" && (
                    <button onClick={() => remove(c.id)} className="text-xs text-destructive underline">Delete</button>
                  )}
                </div>
                <p className="mt-1 text-sm">{c.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
        {!data?.comments?.length && (
          <div className="text-sm text-muted-foreground">No comments yet.</div>
        )}
      </div>
    </div>
  );
}
