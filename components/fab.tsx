"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Fab({ href = "#new-post" }: { href?: string }) {
  return (
    <motion.div className="fixed bottom-6 right-6 z-40" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href={href}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transition-transform duration-300 hover:scale-105"
        aria-label="Create new post"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </motion.div>
  );
}
