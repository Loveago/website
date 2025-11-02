import PostsTable from "@/components/admin/PostsTable";

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Posts</h1>
      <PostsTable />
    </div>
  );
}
