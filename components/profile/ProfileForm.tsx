"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      const u = data?.user ?? {};
      setName(u.name ?? "");
      setEmail(u.email ?? "");
      setUsername(u.username ?? "");
      setImage(u.image ?? null);
      setBio(u.bio ?? "");
      setLoading(false);
    })();
  }, []);

  async function uploadAvatar() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || "Upload failed");
        return;
      }
      const data = await res.json();
      setImage(data.url);
      toast.success("Avatar uploaded");
    };
    input.click();
  }

  async function saveProfile() {
    if (!confirm("Save profile changes?")) return;
    setSaving(true);
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username: username || null, email, password: password || null, image, bio }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Failed to update profile");
      return;
    }
    setPassword("");
    toast.success("Profile updated");
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="rounded-2xl border p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar src={image} className="h-24 w-24" />
        <Button variant="outline" onClick={uploadAvatar}>Change Avatar</Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="optional" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="leave blank to keep" />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea id="bio" className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="gradient" onClick={saveProfile} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
      </div>
    </div>
  );
}
