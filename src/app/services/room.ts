import axios from "axios";

// RUANGAN
export const fetchRuangan = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/rooms`);
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
    const response = await axios.post(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/rooms`, data);
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
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/rooms/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

export const deleteRuangan = async (id: string) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/rooms/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};