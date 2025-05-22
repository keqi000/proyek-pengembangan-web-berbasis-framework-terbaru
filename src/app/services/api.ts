import axios from "axios";

// DOSEN-MATAKULIAH RELATIONSHIP
export const assignDosenToMataKuliah = async (
  dosenId: string,
  mataKuliahId: string
) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/lecturer-course`, {
      lecturer_id: dosenId,
      course_id: mataKuliahId,
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning lecturer to course:", error);
    throw error;
  }
};

export const removeDosenFromMataKuliah = async (
  dosenId: string,
  mataKuliahId: string
) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/lecturer-course`, {
      data: {
        lecturer_id: dosenId,
        course_id: mataKuliahId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing lecturer from course:", error);
    throw error;
  }
};

export const getDosenForMataKuliah = async (mataKuliahId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/course/${mataKuliahId}/lecturers`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching lecturers for course:", error);
    throw error;
  }
};

export const getMataKuliahForDosen = async (dosenId: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/lecturer/${dosenId}/courses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses for lecturer:", error);
    throw error;
  }
};

// JADWAL
export const fetchJadwal = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/schedules`);
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

export const generateJadwal = async (clearExisting = true) => {
  try {
    console.log("Generating jadwal with clearExisting:", clearExisting);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/schedules/generate`, {
      clear_existing: clearExisting,
    });

    console.log("Generate jadwal response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error generating schedules:", error);
    // if (error.response) {
    //   console.error("Error response status:", error.response.status);
    //   console.error("Error response data:", error.response.data);
    //   console.error("Error response headers:", error.response.headers);
    // } else if (error.request) {
    //   console.error("Error request:", error.request);
    // } else {
    //   console.error("Error message:", error.message);
    // }
    throw error;
  }
};

export const deleteJadwal = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/schedules/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};

export const deleteAllJadwal = async () => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/schedules`);
    return response.data;
  } catch (error) {
    console.error("Error deleting all schedules:", error);
    throw error;
  }
};

export const filterJadwalByDay = async (day: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/schedules/day/${day}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering schedules by day:", error);
    throw error;
  }
};

export const searchJadwal = async (query: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/schedules/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching schedules:", error);
    throw error;
  }
};

export const exportJadwalToCsv = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/schedules/export`);

    // Jika response berisi data file yang digenerate
    if (response.data && response.data.generated_file) {
      return response.data;
    }

    // Jika response adalah file CSV langsung
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "jadwal_kuliah.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    console.error("Error exporting schedules to CSV:", error);
    throw error;
  }
};

// Generated Files API
export type GeneratedFileResponse = {
  id: string;
  name: string;
  date: string;
  size: string;
  status: string;
  description?: string;
};

export const fetchGeneratedFiles = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/generated-files`);
    return response.data;
  } catch (error) {
    console.error("Error fetching generated files:", error);
    throw error;
  }
};

export type GeneratedFileDetailsResponseType = {
  id: string;
  name: string;
  date: string;
  size: number;
  status: string;
  description: string;
  type: string;
}

export const getGeneratedFileDetails = async (id: string) => {
  try {
    const response = await axios.get<GeneratedFileDetailsResponseType>(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/generated-files/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching file details:", error);
    throw error;
  }
};

export const downloadGeneratedFile = async (id: string) => {
  try {
    window.open(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/generated-files/${id}/download`, "_blank");
    return true;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const deleteGeneratedFile = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/generated-files/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

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
