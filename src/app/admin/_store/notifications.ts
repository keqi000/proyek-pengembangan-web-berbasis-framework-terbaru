"use client";

import { create } from "zustand";
import {
  fetchNotifications,
  fetchUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  NotificationItem,
} from "../../services/notification";

type NotificationStore = {
  data: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;

  // Fetch all notifications
  fetchData: () => Promise<void>;

  // Fetch unread notifications
  fetchUnreadCount: () => Promise<void>;

  // Mark notification as read
  markAsRead: (id: string) => Promise<void>;

  // Mark all notifications as read
  markAllAsRead: () => Promise<void>;

  // Delete notification
  deleteNotification: (id: string) => Promise<void>;

  // Delete all notifications
  deleteAllNotifications: () => Promise<void>;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  data: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchNotifications();
      set({
        data,
        unreadCount: data.filter((item: NotificationItem) => !item.read).length,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const data = await fetchUnreadNotifications();
      set({ unreadCount: data.length });
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  },

  markAsRead: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await markNotificationAsRead(id);

      // Update local state
      const updatedData = get().data.map((item) =>
        item.id === id ? { ...item, read: true } : item
      );

      set({
        data: updatedData,
        unreadCount: updatedData.filter((item) => !item.read).length,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  markAllAsRead: async () => {
    set({ loading: true, error: null });
    try {
      await markAllNotificationsAsRead();

      // Update local state
      const updatedData = get().data.map((item) => ({ ...item, read: true }));

      set({
        data: updatedData,
        unreadCount: 0,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  deleteNotification: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteNotification(id);

      // Update local state
      const updatedData = get().data.filter((item) => item.id !== id);

      set({
        data: updatedData,
        unreadCount: updatedData.filter((item) => !item.read).length,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },

  deleteAllNotifications: async () => {
    set({ loading: true, error: null });
    try {
      await deleteAllNotifications();

      set({
        data: [],
        unreadCount: 0,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        loading: false,
      });
    }
  },
}));
