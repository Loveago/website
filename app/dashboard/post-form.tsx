"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RichEditor from "@/components/editor/RichEditor";
import { toast } from "sonner";

export default function NewPostForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to create post");
      toast.error(data.error || "Failed to create post");
      return;
    }
    (form as HTMLFormElement).reset();
    setContent("");
    toast.success("Post created");
    window.location.reload();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border p-4 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-2">
        <Label>Content</Label>
        <RichEditor value={content} onChange={setContent} />
      </div>
      {error && <div className="text-sm text-destructive">{error}</div>}
      <Button type="submit" disabled={loading}>{loading ? "Posting..." : "Create Post"}</Button>
    </form>
  );
}
