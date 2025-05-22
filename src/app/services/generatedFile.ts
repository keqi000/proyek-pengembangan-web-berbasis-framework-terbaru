import axios from "axios";

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