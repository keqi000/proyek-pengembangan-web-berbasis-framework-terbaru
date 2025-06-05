import { getStudentCourses, getAvailableCourses, EnrollmentItem } from "./studentEnrollment";
import { getStudentSchedule } from "./studentSchedule";

export interface DashboardStats {
  totalCourses: number;
  enrolledCourses: number;
  totalSchedules: number;
  currentSemester: string;
  academicYear: string;
  studentStatus: string;
  completionRate: number;
}

export interface RecentActivity {
  id: string;
  type: "enrollment" | "schedule" | "announcement";
  title: string;
  description: string;
  date: string;
  time: string;
  course?: string;
  lecturer?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  course: string;
  date: string;
  type: "course" | "general" | "exam";
}

// Get dashboard statistics for student
export const getStudentDashboardStats = async (
  userId: string
): Promise<DashboardStats> => {
  try {
    console.log("Fetching dashboard stats for user:", userId);

    const [enrolledCoursesRes, availableCoursesRes, schedulesRes] =
      await Promise.all([
        getStudentCourses(userId),
        getAvailableCourses(),
        getStudentSchedule(userId),
      ]);

    const enrolledCourses = enrolledCoursesRes || [];
    const availableCourses = availableCoursesRes || [];
    const schedules = schedulesRes || [];

    const completionRate =
      availableCourses.length > 0
        ? Math.round((enrolledCourses.length / availableCourses.length) * 100)
        : 0;

    console.log("Dashboard stats:", {
      totalCourses: availableCourses.length,
      enrolledCourses: enrolledCourses.length,
      totalSchedules: schedules.length,
      completionRate,
    });

    return {
      totalCourses: availableCourses.length,
      enrolledCourses: enrolledCourses.length,
      totalSchedules: schedules.length,
      currentSemester: "6",
      academicYear: "2024/2025",
      studentStatus: "AKTIF",
      completionRate,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalCourses: 0,
      enrolledCourses: 0,
      totalSchedules: 0,
      currentSemester: "6",
      academicYear: "2024/2025",
      studentStatus: "AKTIF",
      completionRate: 0,
    };
  }
};

// Get recent activities
export const getRecentActivities = async (
  userId: string
): Promise<RecentActivity[]> => {
  try {
    console.log("Fetching recent activities for user:", userId);

    const [enrollments, schedules] = await Promise.all([
      getStudentCourses(userId),
      getStudentSchedule(userId),
    ]);

    const activities: RecentActivity[] = [];

    // Add enrollment activities
    if (enrollments && enrollments.length > 0) {
      const recentEnrollments = enrollments
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3);

      recentEnrollments.forEach((enrollment: EnrollmentItem) => {
        activities.push({
          id: `enrollment-${enrollment.id}`,
          type: "enrollment",
          title: `Terdaftar di ${enrollment.course.nama}`,
          description: `Anda telah terdaftar di mata kuliah ${enrollment.course.nama} (${enrollment.course.kode})`,
          date: new Date(enrollment.created_at).toLocaleDateString("id-ID"),
          time: new Date(enrollment.created_at).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          course: enrollment.course.nama,
          lecturer: enrollment.assigned_lecturer || "Belum ditentukan",
        });
      });
    }

    // Add schedule activities (if any new schedules)
    if (schedules && schedules.length > 0) {
      const todaySchedules = schedules.filter((schedule: any) => {
        const today = new Date().toLocaleDateString("id-ID", {
          weekday: "long",
        });
        const scheduleDay = schedule.hari;
        return scheduleDay.toLowerCase() === today.toLowerCase();
      });

      if (todaySchedules.length > 0) {
        activities.push({
          id: `schedule-today`,
          type: "schedule",
          title: `Jadwal Hari Ini`,
          description: `Anda memiliki ${todaySchedules.length} jadwal kuliah hari ini`,
          date: new Date().toLocaleDateString("id-ID"),
          time: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    }

    // Sort by most recent
    activities.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

    console.log("Recent activities:", activities.length);
    return activities.slice(0, 5); // Limit to 5 most recent
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return [];
  }
};

// Get announcements (mock data for now, can be replaced with real API)
export const getAnnouncements = async (
  userId?: string
): Promise<Announcement[]> => {
  try {
    // For now, return enhanced mock data
    // In the future, this can be replaced with real API call
    const announcements: Announcement[] = [
      {
        id: "1",
        title: "PENGEMBANGAN APLIKASI WEB",
        content:
          "Pengumuman terkait tugas dan jadwal kuliah. Harap perhatikan deadline pengumpulan tugas yang telah ditentukan.",
        author: "XAVERIUS B.N. NAJOAN ST, MT",
        course: "Pengembangan Aplikasi Web",
        date: new Date().toLocaleDateString("id-ID"),
        type: "course",
      },
      {
        id: "2",
        title: "KEAMANAN SIBER",
        content:
          "Informasi terkait materi dan ujian. Silakan pelajari materi yang telah diberikan untuk persiapan ujian.",
        author: "XAVERIUS B.N. NAJOAN ST, MT",
        course: "Keamanan Siber",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(
          "id-ID"
        ),
        type: "course",
      },
      {
        id: "3",
        title: "PENGUMUMAN UMUM",
        content:
          "Jadwal kuliah telah diperbarui. Silakan cek jadwal terbaru di sistem.",
        author: "Admin Akademik",
        course: "Umum",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(
          "id-ID"
        ),
        type: "general",
      },
    ];

    // If userId is provided, we could filter announcements based on enrolled courses
    if (userId) {
      try {
        const enrolledCourses = await getStudentCourses(userId);
        const enrolledCourseNames = enrolledCourses.map((enrollment: any) =>
          enrollment.course.nama.toLowerCase()
        );

        // Filter announcements to show only relevant ones
        return announcements.filter(
          (announcement) =>
            announcement.type === "general" ||
            enrolledCourseNames.some((courseName) =>
              announcement.course.toLowerCase().includes(courseName)
            )
        );
      } catch (error) {
        console.error("Error filtering announcements:", error);
        return announcements;
      }
    }

    return announcements;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
};

// Get today's schedule summary
export const getTodayScheduleSummary = async (userId: string) => {
  try {
    const schedules = await getStudentSchedule(userId);
    const today = new Date().toLocaleDateString("id-ID", { weekday: "long" });

    const todaySchedules = schedules.filter((schedule: any) => {
      return schedule.hari.toLowerCase() === today.toLowerCase();
    });

    return {
      total: todaySchedules.length,
      schedules: todaySchedules,
      hasSchedule: todaySchedules.length > 0,
    };
  } catch (error) {
    console.error("Error getting today's schedule:", error);
    return {
      total: 0,
      schedules: [],
      hasSchedule: false,
    };
  }
};
