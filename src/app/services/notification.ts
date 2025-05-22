import axios from "axios";

// Tipe data untuk notifikasi
export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: "jadwal" | "peringatan" | "sistem" | "info";
  read: boolean;
  related_model?: string;
  related_id?: string;
  time: string;
  date: string;
  created_at: string;
  updated_at: string;
};

// Fungsi untuk mengambil semua notifikasi
export const fetchNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/notifications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Fungsi untuk mengambil notifikasi yang belum dibaca
export const fetchUnreadNotifications = async (): Promise<
  NotificationItem[]
> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/notifications/unread`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw error;
  }
};

// Fungsi untuk menandai notifikasi sebagai telah dibaca
export const markNotificationAsRead = async (id: string) => {
  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Fungsi untuk menandai semua notifikasi sebagai telah dibaca
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/notifications/read-all`);
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Fungsi untuk menghapus notifikasi
export const deleteNotification = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Fungsi untuk menghapus semua notifikasi
export const deleteAllNotifications = async () => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/notifications`);
    return response.data;
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    throw error;
  }
};

export const createScheduleNotification = async () => {
  try {
    const notificationData = {
      title: "Jadwal Baru Telah Digenerate",
      message:
        "Silahkan download file atau lihat perincian di halaman Generate Jadwal",
      type: "jadwal",
      related_model: "schedule",
      related_id: null, // We're not linking to a specific schedule
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/notifications`,
      notificationData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating schedule notification:", error);
    throw error;
  }
};
