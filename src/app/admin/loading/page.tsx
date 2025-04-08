// app/admin/loading/page.tsx

"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-blue-600">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </motion.div>
      <motion.p
        className="mt-4 text-xl font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 1], y: [10, 0, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatType: "loop" }}
      >
        Loading...
      </motion.p>
    </div>
  );
}
