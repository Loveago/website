import AdminUsers from "../users";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Users</h1>
      <AdminUsers />
    </div>
  );
}
