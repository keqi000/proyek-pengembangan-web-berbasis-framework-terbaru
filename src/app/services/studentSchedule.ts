import axios from "axios";

const api = axios.create({
  timeout: 10000,
});

export interface ScheduleItem {
  id: string;
  hari: string;
  waktu: string;
  mataKuliah: string;
  namaDosen: string;
  ruangan: string;
  semester: string;
  kode: string;
}

// Track ongoing requests to prevent duplicates
const ongoingRequests = new Map<string, Promise<any>>();

// Get student's schedule based on enrolled courses
export const getStudentSchedule = async (
  userId: string
): Promise<ScheduleItem[]> => {
  if (!userId) {
    console.log("No userId provided");
    return [];
  }

  const requestKey = `student-schedule-${userId}`;

  // Return ongoing request if exists
  if (ongoingRequests.has(requestKey)) {
    console.log("Returning ongoing request for student schedule");
    return ongoingRequests.get(requestKey);
  }

  const requestPromise = (async () => {
    try {
      console.log("Fetching schedule for student:", userId);

      const response = await api.get(
        `${process.env.NEXT_PUBLIC_APi_BASE_URL}/student/${userId}/schedule`
      );

      const schedules = response.data || [];
      console.log("Fetched student schedules:", schedules.length);

      return schedules;
    } catch (error) {
      console.error("Error fetching student schedule:", error);
      return [];
    } finally {
      // Remove from ongoing requests when done
      ongoingRequests.delete(requestKey);
    }
  })();

  // Store the promise
  ongoingRequests.set(requestKey, requestPromise);
  return requestPromise;
};

// Get all schedules (for reference)
export const getAllSchedules = async (): Promise<ScheduleItem[]> => {
  try {
    const response = await api.get(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/schedules`
    );

    const schedules = response.data || [];
    return schedules.map((schedule: any) => ({
      id: schedule.id,
      hari: schedule.hari,
      waktu: schedule.waktu,
      mataKuliah: schedule.mataKuliah,
      namaDosen: schedule.namaDosen,
      ruangan: schedule.ruangan,
      semester: schedule.semester,
      kode: schedule.kode || "",
    }));
  } catch (error) {
    console.error("Error fetching all schedules:", error);
    return [];
  }
};
