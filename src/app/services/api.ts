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

