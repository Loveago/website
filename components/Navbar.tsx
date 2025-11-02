"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;

  return (
    <nav className="w-full border-b/0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-teal-500/10 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <motion.div whileHover={{ scale: 1.03, rotate: -0.5 }}>
            <Link href="/" className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-lg font-extrabold text-transparent dark:from-indigo-400 dark:to-purple-400">
              Modern Blog
            </Link>
          </motion.div>
          <Link href="/" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Home</Link>
          {session && <Link href="/dashboard" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Dashboard</Link>}
          {role === "ADMIN" && <Link href="/admin" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Admin</Link>}
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {!session ? (
            <>
              <Button variant="outline" onClick={() => signIn()} className="transition-all duration-300 hover:shadow-md">
                Login
              </Button>
              <Link href="/signup">
                <Button variant="gradient" className="transition-all duration-300 hover:shadow-md">Sign Up</Button>
              </Link>
            </>
          ) : (
            <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })} className="transition-all duration-300 hover:shadow-md">
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
