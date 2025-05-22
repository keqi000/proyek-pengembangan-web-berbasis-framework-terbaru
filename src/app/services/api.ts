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