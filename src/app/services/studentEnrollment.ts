import axios from "axios";

// Set timeout untuk mencegah hanging requests
const api = axios.create({
  timeout: 10000, // 10 seconds timeout
});

export interface CourseItem {
  id: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
  lecturers?: Array<{
    id: string;
    nama: string;
    nip: string;
  }>;
}

export interface EnrollmentItem {
  id: string;
  user_id: string;
  course_id: string;
  semester: string;
  tahun_akademik: string;
  status: string;
  course: CourseItem;
  created_at: string;
  updated_at: string;
}

// Cache untuk mencegah multiple calls
let availableCoursesCache: CourseItem[] | null = null;
let studentCoursesCache: { [userId: string]: EnrollmentItem[] } = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Get available courses
export const getAvailableCourses = async (): Promise<CourseItem[]> => {
  try {
    console.log("Fetching available courses...");

    // Check cache
    const now = Date.now();
    if (availableCoursesCache && now - cacheTimestamp < CACHE_DURATION) {
      console.log("Returning cached available courses");
      return availableCoursesCache;
    }

    const response = await api.get(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/courses/available`
    );
    const courses = response.data || [];

    console.log("Fetched available courses:", courses.length);

    // Update cache
    availableCoursesCache = courses;
    cacheTimestamp = now;

    return courses;
  } catch (error) {
    console.error("Error fetching available courses:", error);

    // Return cache if available, otherwise empty array
    if (availableCoursesCache) {
      console.log("Returning cached data due to error");
      return availableCoursesCache;
    }

    return [];
  }
};

// Get student's enrolled courses
export const getStudentCourses = async (
  userId: string
): Promise<EnrollmentItem[]> => {
  try {
    if (!userId) {
      console.log("No userId provided");
      return [];
    }

    console.log("Fetching courses for student:", userId);

    // Check cache
    const now = Date.now();
    if (studentCoursesCache[userId] && now - cacheTimestamp < CACHE_DURATION) {
      console.log("Returning cached student courses");
      return studentCoursesCache[userId];
    }

    const response = await api.get(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/student/${userId}/courses`
    );
    const courses = response.data || [];

    console.log("Fetched student courses:", courses.length);

    // Update cache
    studentCoursesCache[userId] = courses;
    cacheTimestamp = now;

    return courses;
  } catch (error) {
    console.error("Error fetching student courses:", error);

    // Return cache if available, otherwise empty array
    if (studentCoursesCache[userId]) {
      console.log("Returning cached data due to error");
      return studentCoursesCache[userId];
    }

    return [];
  }
};

// Clear cache when enrolling/unenrolling
const clearCache = (userId?: string) => {
  availableCoursesCache = null;
  if (userId) {
    delete studentCoursesCache[userId];
  } else {
    studentCoursesCache = {};
  }
  cacheTimestamp = 0;
};

// Enroll in course
export const enrollInCourse = async (data: {
  user_id: string;
  course_id: string;
  semester: string;
}): Promise<EnrollmentItem> => {
  try {
    console.log("Enrolling in course:", data);

    const response = await api.post(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/student/enroll`,
      data
    );

    // Clear cache after successful enrollment
    clearCache(data.user_id);

    return response.data.data;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
};

// Unenroll from course
export const unenrollFromCourse = async (data: {
  user_id: string;
  course_id: string;
}): Promise<void> => {
  try {
    console.log("Unenrolling from course:", data);

    await api.delete(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/student/unenroll`,
      { data }
    );

    // Clear cache after successful unenrollment
    clearCache(data.user_id);
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    throw error;
  }
};
