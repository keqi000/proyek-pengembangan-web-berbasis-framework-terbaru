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
