import axios from "axios";

//MATA KULIAH
export const fetchMataKuliah = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course`);
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
    const response = await axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course`, data);
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
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteMataKuliah = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
