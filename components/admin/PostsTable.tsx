"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

type PostRow = {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  author?: { name: string | null; email: string } | null;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PostsTable() {
  const { data, isLoading, mutate } = useSWR<{ posts: PostRow[] }>("/api/admin/posts", fetcher);

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/admin/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    mutate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    mutate();
  }

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading posts…</div>;

  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="text-left">
            <th className="p-3">Title</th>
            <th className="p-3">Author</th>
            <th className="p-3">Date</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {data?.posts?.map((p) => (
            <tr key={p.id} className="hover:bg-muted/20">
              <td className="p-3 font-medium">{p.title}</td>
              <td className="p-3">{p.author?.name ?? p.author?.email ?? "—"}</td>
              <td className="p-3">{new Date(p.createdAt).toLocaleString()}</td>
              <td className="p-3">
                <span className={clsx(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs",
                  p.published ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                )}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => togglePublish(p.id, p.published)}>
                    {p.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button variant="destructive" onClick={() => remove(p.id)}>Delete</Button>
                </div>
              </td>
            </tr>
          ))}
          {!data?.posts?.length && (
            <tr>
              <td className="p-3 text-muted-foreground" colSpan={5}>No posts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
