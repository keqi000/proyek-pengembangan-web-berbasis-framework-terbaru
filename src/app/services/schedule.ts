import axios from "axios";

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
