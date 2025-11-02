import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
