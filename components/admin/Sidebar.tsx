"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

const links = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/posts", label: "Manage Posts", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <motion.aside
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="sticky top-0 h-[calc(100vh-0px)] w-60 shrink-0 border-r bg-background/60 backdrop-blur"
    >
      <div className="p-4">
        <div className="mb-4 text-xs font-semibold uppercase text-muted-foreground">Admin</div>
        <nav className="space-y-1">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={clsx(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all",
                active ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-foreground" : "text-foreground/80 hover:text-foreground hover:bg-foreground/5"
              )}>
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}
