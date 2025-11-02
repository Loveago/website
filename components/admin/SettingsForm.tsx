"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Settings = {
  id: number;
  siteName: string;
  tagline: string | null;
  faviconUrl: string | null;
} | null;

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [siteName, setSiteName] = useState(initial?.siteName ?? "Modern Blog");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [faviconUrl, setFaviconUrl] = useState(initial?.faviconUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteName, tagline: tagline || null, faviconUrl: faviconUrl || null }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Failed to save settings");
      return;
    }
    setSaved(true);
  }

  return (
    <div className="max-w-lg space-y-4 rounded-2xl border p-4">
      <div className="space-y-2">
        <Label htmlFor="siteName">Site Name</Label>
        <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="faviconUrl">Favicon URL</Label>
        <Input id="faviconUrl" value={faviconUrl} onChange={(e) => setFaviconUrl(e.target.value)} placeholder="https://.../favicon.ico" />
      </div>
      {error && <div className="text-sm text-destructive">{error}</div>}
      {saved && <div className="text-sm text-green-600">Saved!</div>}
      <Button variant="gradient" onClick={onSave} disabled={saving}>
        {saving ? "Saving..." : "Save Settings"}
      </Button>
      <div className="text-xs text-muted-foreground">Reload the page to see title and favicon changes.</div>
    </div>
  );
}
