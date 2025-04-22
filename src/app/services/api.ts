import axios from "axios";

const API_URL = "http://localhost:8000/api";

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
