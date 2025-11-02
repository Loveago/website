"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminUsers() {
  const { data, mutate } = useSWR<{ users: Array<{ id: string; name: string | null; email: string; role: string }> }>(
    "/api/admin/users",
    fetcher
  );

  async function promote(id: string) {
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "ADMIN" }) });
    mutate();
  }
  async function remove(id: string) {
    if (!confirm("Delete this user? This will remove their posts too.")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Users</h2>
      <div className="rounded-md border">
        <div className="grid grid-cols-4 border-b px-3 py-2 text-sm text-muted-foreground">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          {data?.users?.map((u) => (
            <div key={u.id} className="grid grid-cols-4 items-center px-3 py-2 text-sm">
              <div>{u.name ?? "—"}</div>
              <div>{u.email}</div>
              <div>{u.role}</div>
              <div className="flex gap-2">
                {u.role !== "ADMIN" && (
                  <Button variant="outline" onClick={() => promote(u.id)}>Promote</Button>
                )}
                <Button variant="destructive" onClick={() => remove(u.id)}>Delete</Button>
              </div>
            </div>
          ))}
          {!data?.users?.length && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
