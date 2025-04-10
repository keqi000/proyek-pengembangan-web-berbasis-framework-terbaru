'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoadingPage() {
  return (
    <div className="fixed inset-0 bg-[#DCD7C9] flex items-center justify-center font-poppins overflow-hidden">
      <motion.div
        className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Loader2 className="h-12 w-12 sm:h-14 sm:w-14 animate-spin text-[#A27B5C]" />
        <motion.p
          className="mt-4 text-base sm:text-lg font-semibold text-[#2C3930] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 1], y: [10, 0, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop' }}
        >
          Sedang memuat data...
        </motion.p>
      </motion.div>
    </div>
  );
}
