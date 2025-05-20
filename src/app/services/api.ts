import axios from "axios";

const API_URL = "http://localhost:8000/api";

//MATA KULIAH
export const fetchMataKuliah = async () => {
  try {
    const response = await axios.get(`${API_URL}/course`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const createMataKuliah = async (data: {
  kode: string;
  nama: string;
  semester: string;
  sks: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/course`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

export const updateMataKuliah = async (
  id: string,
  data: { kode: string; nama: string; semester: string; sks: string }
) => {
  try {
    const response = await axios.patch(`${API_URL}/course/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteMataKuliah = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/course/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

//DOSEN
export const fetchDosen = async () => {
  try {
    const response = await axios.get(`${API_URL}/lecturer`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    throw error;
  }
};

export const createDosen = async (data: { nama: string; nip: string }) => {
  try {
    const response = await axios.post(`${API_URL}/lecturer`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating lecturer:", error);
    throw error;
  }
};

export const updateDosen = async (
  id: string,
  data: { nama: string; nip: string }
) => {
  try {
    const response = await axios.patch(`${API_URL}/lecturer/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating lecturer:", error);
    throw error;
  }
};

export const deleteDosen = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/lecturer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    throw error;
  }
};

// DOSEN-MATAKULIAH RELATIONSHIP
export const assignDosenToMataKuliah = async (
  dosenId: string,
  mataKuliahId: string
) => {
  try {
    const response = await axios.post(`${API_URL}/lecturer-course`, {
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
    const response = await axios.delete(`${API_URL}/lecturer-course`, {
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
      `${API_URL}/course/${mataKuliahId}/lecturers`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching lecturers for course:", error);
    throw error;
  }
};

export const getMataKuliahForDosen = async (dosenId: string) => {
  try {
    const response = await axios.get(`${API_URL}/lecturer/${dosenId}/courses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses for lecturer:", error);
    throw error;
  }
};

// RUANGAN
export const fetchRuangan = async () => {
  try {
    const response = await axios.get(`${API_URL}/rooms`);
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

export const createRuangan = async (data: {
  nama: string;
  kapasitas: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/rooms`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

export const updateRuangan = async (
  id: string,
  data: { nama: string; kapasitas: string }
) => {
  try {
    const response = await axios.patch(`${API_URL}/rooms/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

export const deleteRuangan = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/rooms/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

// JADWAL
export const fetchJadwal = async () => {
  try {
    const response = await axios.get(`${API_URL}/schedules`);
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

export const generateJadwal = async (clearExisting = true) => {
  try {
    console.log("Generating jadwal with clearExisting:", clearExisting);
    const response = await axios.post(`${API_URL}/schedules/generate`, {
      clear_existing: clearExisting,
    });
    console.log("Generate jadwal response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error generating schedules:", error);
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const deleteJadwal = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/schedules/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};

export const deleteAllJadwal = async () => {
  try {
    const response = await axios.delete(`${API_URL}/schedules`);
    return response.data;
  } catch (error) {
    console.error("Error deleting all schedules:", error);
    throw error;
  }
};

export const filterJadwalByDay = async (day: string) => {
  try {
    const response = await axios.get(`${API_URL}/schedules/day/${day}`);
    return response.data;
  } catch (error) {
    console.error("Error filtering schedules by day:", error);
    throw error;
  }
};

export const searchJadwal = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/schedules/search`, {
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
    const response = await axios.get(`${API_URL}/schedules/export`, {
      responseType: "blob",
    });

    // Create a download link for the CSV file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "jadwal_kuliah.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error("Error exporting schedules to CSV:", error);
    throw error;
  }
};
