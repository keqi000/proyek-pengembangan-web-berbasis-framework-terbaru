"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FaBook,
  FaPlus,
  FaTimes,
  FaCheck,
  FaSpinner,
  FaUserTie,
} from "react-icons/fa";
import {
  getAvailableCourses,
  getStudentCourses,
  enrollInCourse,
  unenrollFromCourse,
  CourseItem,
  EnrollmentItem,
} from "../../services/studentEnrollment";

export default function CoursePage() {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrollmentItem[]>([]);
  const [availableCourses, setAvailableCourses] = useState<CourseItem[]>([]);
  const [showCourseSelection, setShowCourseSelection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Use refs to prevent multiple API calls and track component state
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Get user data from localStorage
  const getUserData = useCallback(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }, []);

  const user = getUserData();

  // Reset state when component mounts
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadData = useCallback(async (userId: string) => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current || !isMountedRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log("Loading data for user:", userId);

      const [enrolled, available] = await Promise.all([
        getStudentCourses(userId),
        getAvailableCourses(),
      ]);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        console.log("Enrolled courses:", enrolled);
        console.log("Available courses:", available);

        setEnrolledCourses(enrolled);
        setAvailableCourses(available);
        setDataLoaded(true);
        hasInitializedRef.current = true;
      }
    } catch (err) {
      console.error("Error loading data:", err);
      if (isMountedRef.current) {
        setError("Gagal memuat data mata kuliah");
        setDataLoaded(true);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      isLoadingRef.current = false;
    }
  }, []);

  // Load data only once when component mounts
  useEffect(() => {
    if (
      user &&
      user.role === "mahasiswa" &&
      !hasInitializedRef.current &&
      isMountedRef.current
    ) {
      console.log("Initial data load for user:", user.id);
      loadData(user.id);
    } else if (!user || user.role !== "mahasiswa") {
      setLoading(false);
      setDataLoaded(true);
    }
  }, [user, loadData]);

  const handleEnrollCourse = async (courseId: string) => {
    if (!user || !isMountedRef.current) return;

    setEnrolling(courseId);
    setError(null);

    try {
      const enrollment = await enrollInCourse({
        user_id: user.id,
        course_id: courseId,
        semester: "6",
      });

      if (isMountedRef.current) {
        setEnrolledCourses((prev) => [...prev, enrollment]);
        setSuccess("Berhasil mendaftar mata kuliah!");
        setTimeout(() => {
          if (isMountedRef.current) {
            setSuccess(null);
          }
        }, 3000);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        if (err.response?.status === 409) {
          setError("Anda sudah terdaftar di mata kuliah ini");
        } else {
          setError("Gagal mendaftar mata kuliah");
        }
        console.error(err);
      }
    } finally {
      if (isMountedRef.current) {
        setEnrolling(null);
      }
    }
  };

  const handleUnenrollCourse = async (courseId: string) => {
    if (!user || !isMountedRef.current) return;

    try {
      await unenrollFromCourse({
        user_id: user.id,
        course_id: courseId,
      });

      if (isMountedRef.current) {
        setEnrolledCourses((prev) =>
          prev.filter((enrollment) => enrollment.course_id !== courseId)
        );
        setSuccess("Berhasil membatalkan pendaftaran mata kuliah!");
        setTimeout(() => {
          if (isMountedRef.current) {
            setSuccess(null);
          }
        }, 3000);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError("Gagal membatalkan pendaftaran mata kuliah");
        console.error(err);
      }
    }
  };

  // Filter available courses that are not enrolled
  const getFilteredAvailableCourses = () => {
    const enrolledCourseIds = enrolledCourses.map(
      (enrollment) => enrollment.course_id
    );
    return availableCourses.filter(
      (course) => !enrolledCourseIds.includes(course.id)
    );
  };

  // Show access denied if user is not a student
  if (!user || user.role !== "mahasiswa") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Akses Ditolak</h2>
          <p className="text-gray-600">Halaman ini hanya untuk mahasiswa</p>
        </div>
      </div>
    );
  }

  // Determine what to show based on loading and data state
  const shouldShowLoading = loading && !dataLoaded;
  const shouldShowContent = dataLoaded && !loading;
  const shouldShowEmptyState =
    shouldShowContent && enrolledCourses.length === 0;

  return (
    <div className="bg-gray-100 p-2 sm:p-3 md:p-4 min-h-screen font-poppins">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="bg-[#2C3930] text-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
            Mata Kuliah Saya
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-200">
            Kelola mata kuliah yang Anda ambil untuk semester ini
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-red-700 hover:text-red-900"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
          <button
            onClick={() => setSuccess(null)}
            className="float-right text-green-700 hover:text-green-900"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Add Course Button - Only show when data is loaded */}
      {shouldShowContent && (
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => setShowCourseSelection(true)}
            className="bg-[#4F959D] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#3a7a82] transition-colors flex items-center gap-2 text-sm sm:text-base"
            disabled={loading}
          >
            <FaPlus className="text-xs sm:text-sm" />
            Tambah Mata Kuliah
          </button>
        </div>
      )}

      {/* Enrolled Courses */}
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 text-[#2C3930] flex items-center gap-2">
          <FaBook className="text-[#4F959D]" />
          Mata Kuliah yang Diambil
        </h2>

        {/* Loading State */}
        {shouldShowLoading && (
          <div className="text-center py-8">
            <FaSpinner className="animate-spin mx-auto text-2xl text-[#4F959D] mb-2" />
            <p className="text-gray-500">Memuat data mata kuliah...</p>
          </div>
        )}

        {/* Content State - Show enrolled courses */}
        {shouldShowContent && enrolledCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {enrolledCourses.map((enrollment) => (
              <div
                key={enrollment.id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm sm:text-base text-[#2C3930] line-clamp-2">
                    {enrollment.course.nama}
                  </h3>
                  <button
                    onClick={() => handleUnenrollCourse(enrollment.course_id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Batalkan Pendaftaran"
                  >
                    <FaTimes className="text-xs sm:text-sm" />
                  </button>
                </div>

                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Kode:</span>{" "}
                    {enrollment.course.kode}
                  </p>
                  <p>
                    <span className="font-medium">SKS:</span>{" "}
                    {enrollment.course.sks}
                  </p>
                  <p>
                    <span className="font-medium">Semester:</span>{" "}
                    {enrollment.course.semester}
                  </p>

                  {enrollment.course.lecturers &&
                    enrollment.course.lecturers.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-gray-700 flex items-center gap-1">
                          <FaUserTie className="text-xs" />
                          Dosen:
                        </p>
                        <div className="ml-4">
                          {enrollment.course.lecturers.map((lecturer) => (
                            <p
                              key={lecturer.id}
                              className="text-xs text-gray-600"
                            >
                              {lecturer.nama} ({lecturer.nip})
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <FaCheck className="mr-1 text-xs" />
                    Terdaftar
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State - Only show when data is loaded and no courses */}
        {shouldShowEmptyState && (
          <div className="text-center py-8 text-gray-500">
            <FaBook className="mx-auto text-3xl sm:text-4xl mb-3 text-gray-400" />
            <p className="text-sm sm:text-base">
              Belum ada mata kuliah yang dikontrak
            </p>
            <p className="text-xs sm:text-sm mt-1">
              Klik "Tambah Mata Kuliah" untuk mendaftar
            </p>
          </div>
        )}
      </div>

      {/* Course Selection Modal */}
      {showCourseSelection && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col">
            <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#2C3930]">
                  Pilih Mata Kuliah
                </h3>
                <button
                  onClick={() => setShowCourseSelection(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes className="text-lg sm:text-xl" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 md:p-6 overflow-y-auto flex-1">
              {getFilteredAvailableCourses().length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {getFilteredAvailableCourses().map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 mr-3">
                          <h4 className="font-semibold text-sm sm:text-base text-[#2C3930] mb-1">
                            {course.nama}
                          </h4>

                          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Kode:</span>{" "}
                              {course.kode}
                            </p>
                            <p>
                              <span className="font-medium">SKS:</span>{" "}
                              {course.sks}
                            </p>
                            <p>
                              <span className="font-medium">Semester:</span>{" "}
                              {course.semester}
                            </p>

                            {course.lecturers &&
                              course.lecturers.length > 0 && (
                                <div className="mt-2">
                                  <p className="font-medium text-gray-700 flex items-center gap-1">
                                    <FaUserTie className="text-xs" />
                                    Dosen:
                                  </p>
                                  <div className="ml-4">
                                    {course.lecturers.map((lecturer) => (
                                      <p
                                        key={lecturer.id}
                                        className="text-xs text-gray-600"
                                      >
                                        {lecturer.nama} ({lecturer.nip})
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleEnrollCourse(course.id)}
                          disabled={enrolling === course.id}
                          className="ml-3 bg-[#4F959D] text-white px-3 py-1.5 rounded-lg hover:bg-[#3a7a82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm flex items-center gap-1"
                        >
                          {enrolling === course.id ? (
                            <>
                              <FaSpinner className="animate-spin text-xs" />
                              Mendaftar...
                            </>
                          ) : (
                            <>
                              <FaPlus className="text-xs" />
                              Daftar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaBook className="mx-auto text-3xl mb-3 text-gray-400" />
                  <p className="text-sm sm:text-base">
                    Tidak ada mata kuliah yang tersedia
                  </p>
                  <p className="text-xs sm:text-sm mt-1">
                    Semua mata kuliah sudah Anda ambil
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setShowCourseSelection(false)}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
