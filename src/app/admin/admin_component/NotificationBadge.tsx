"use client";

import React, { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNotificationStore } from "../_store/notifications";
import Link from "next/link";

const NotificationBadge = () => {
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    // Fetch unread count on mount
    fetchUnreadCount();

    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <Link href="/admin/notifications" className="relative">
      <FaBell
        className="text-gray-600 hover:text-[#4F959D] transition-colors"
        size={20}
      />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBadge;
