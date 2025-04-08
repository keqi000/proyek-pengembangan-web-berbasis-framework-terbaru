"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
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
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Memuat...
      </motion.p>
    </div>
  );
}
