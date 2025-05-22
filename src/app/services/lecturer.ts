import axios from "axios";

//DOSEN
export const fetchDosen = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/lecturer`);
    return response.data;
  } catch (error) {
    console.error("Error fetching lecturers:", error);
    throw error;
  }
};

export const createDosen = async (data: { nama: string; nip: string }) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/lecturer`, data);
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
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/lecturer/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating lecturer:", error);
    throw error;
  }
};

export const deleteDosen = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/lecturer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lecturer:", error);
    throw error;
  }
};