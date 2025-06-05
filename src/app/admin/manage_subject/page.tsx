"use client";

import React, { useState, useEffect } from "react";
import { useMataKuliahStore } from "../_store/matakuliah";
import { useDosenStore } from "../_store/dosen";
import { useDosenMatakuliahStore } from "../_store/dosenMatakuliah";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaBook,
  FaUserTie,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { CourseTempInputData } from "../_scheme/course";
import { fetchDosen } from "../../services/lecturer";
import axios from "axios";

// API Service untuk mata kuliah

const fetchMataKuliahFromAPI = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/course`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

const createMataKuliahAPI = async (data: {
  kode: string;
  nama: string;
  semester: string;
  sks: string;
}) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/course`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

// Update the updateMataKuliahAPI function
const updateMataKuliahAPI = async (
  id: string,
  data: { kode: string; nama: string; semester: string; sks: string }
) => {
  try {
    // Log the request for debugging
    console.log(`Updating course with ID: ${id}`, data);

    // Make sure the API URL is correct
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/course/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    // More detailed error logging
    console.error("Error updating course:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Server response:", error.response.data);
    }
    throw error;
  }
};

const deleteMataKuliahAPI = async (id: string) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_APi_BASE_URL}/course/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

const KelolaMataKuliah = () => {
  const mataKuliahList = useMataKuliahStore((state) => state.data);
  const setMataKuliahList = useMataKuliahStore((state) => state.setData);
  const addMataKuliah = useMataKuliahStore((state) => state.addData);
  const updateMataKuliah = useMataKuliahStore((state) => state.updateData);
  const deleteMataKuliah = useMataKuliahStore((state) => state.deleteData);

  const dosenList = useDosenStore((state) => state.data);

  // Dosen-Matakuliah assignment store
  const dosenMatakuliahStore = useDosenMatakuliahStore();
  const { addAssignment, removeAssignment, getDosenByMataKuliah } =
    dosenMatakuliahStore;

  const [tempInput, setTempInput] = useState<CourseTempInputData>({
    kode: "",
    nama: "",
    semester: "",
    sks: "",
  });

  const [editPopup, setEditPopup] = useState(false);
  const [selectedMataKuliah, setSelectedMataKuliah] =
    useState<CourseTempInputData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // New state for lecturer assignment popup
  const [showDosenAssignmentPopup, setShowDosenAssignmentPopup] =
    useState(false);
  const [currentMataKuliahId, setCurrentMataKuliahId] = useState<string | null>(
    null
  );
  const [selectedDosens, setSelectedDosens] = useState<string[]>([]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [mataKuliahToDelete, setMataKuliahToDelete] = useState<string | null>(
    null
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const loadMataKuliah = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchMataKuliahFromAPI();
        setMataKuliahList(data);
      } catch (err) {
        setError("Gagal memuat data mata kuliah");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMataKuliah();
  }, [setMataKuliahList]);

  // Load selected dosens when opening the assignment popup
  useEffect(() => {
    if (currentMataKuliahId) {
      const assignedDosens = getDosenByMataKuliah(currentMataKuliahId);
      setSelectedDosens(assignedDosens);
    }
  }, [currentMataKuliahId, getDosenByMataKuliah]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dosen data if not already loaded
        if (dosenList.length === 0) {
          const dosenData = await fetchDosen();
          useDosenStore.getState().setData(dosenData);
        }

        // Load all lecturer-course assignments for each course
        const loadAssignments = async () => {
          for (const course of mataKuliahList) {
            if (course.id) {
              await useDosenMatakuliahStore
                .getState()
                .loadAssignmentsForCourse(course.id);
            }
          }
        };

        loadAssignments();
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadData();
  }, [mataKuliahList, dosenList.length]);

  const handleSubmit = async () => {
    if (
      !tempInput.kode ||
      !tempInput.nama ||
      !tempInput.semester ||
      !tempInput.sks
    ) {
      alert("Harap isi semua field!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (tempInput.id) {
        // Update existing mata kuliah
        const updatedData = await updateMataKuliahAPI(tempInput.id, {
          kode: tempInput.kode,
          nama: tempInput.nama,
          semester: tempInput.semester,
          sks: tempInput.sks,
        });

        // Update local state with API response
        updateMataKuliah(
          tempInput.id,
          updatedData.kode,
          updatedData.nama,
          updatedData.semester,
          updatedData.sks
        );
      } else {
        // Create new mata kuliah
        const newData = await createMataKuliahAPI({
          kode: tempInput.kode,
          nama: tempInput.nama,
          semester: tempInput.semester,
          sks: tempInput.sks,
        });

        // Add new data to local state
        addMataKuliah({
          kode: newData.kode,
          nama: newData.nama,
          semester: newData.semester,
          sks: newData.sks,
        });
      }

      setTempInput({ kode: "", nama: "", semester: "", sks: "" });
      setShowAddForm(false);
    } catch (err) {
      setError("Gagal menyimpan data mata kuliah");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (mataKuliah: CourseTempInputData) => {
    // Make sure the ID is included and valid
    console.log("Editing course with ID:", mataKuliah.id);
    setSelectedMataKuliah(mataKuliah);
    setEditPopup(true);
  };

  // Update the handleConfirmEdit function
  const handleConfirmEdit = async () => {
    if (selectedMataKuliah !== null && selectedMataKuliah.id) {
      if (
        !selectedMataKuliah.kode ||
        !selectedMataKuliah.nama ||
        !selectedMataKuliah.semester ||
        !selectedMataKuliah.sks
      ) {
        alert("Harap isi semua field!");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Convert semester and sks to the correct data types if needed
        // For example, if the server expects numbers instead of strings:
        const updatedData = await updateMataKuliahAPI(selectedMataKuliah.id, {
          kode: selectedMataKuliah.kode,
          nama: selectedMataKuliah.nama,
          semester: selectedMataKuliah.semester, // Consider parseInt(selectedMataKuliah.semester) if needed
          sks: selectedMataKuliah.sks, // Consider parseInt(selectedMataKuliah.sks) if needed
        });

        // Update local state
        updateMataKuliah(
          selectedMataKuliah.id,
          updatedData.kode,
          updatedData.nama,
          updatedData.semester,
          updatedData.sks
        );

        setEditPopup(false);
      } catch (err) {
        setError("Gagal memperbarui data mata kuliah");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditPopup(false);
  };

  // New function to open dosen assignment popup
  const handleAssignDosen = async (mataKuliahId: string) => {
    setCurrentMataKuliahId(mataKuliahId);

    // Load fresh data for this specific course
    try {
      await useDosenMatakuliahStore
        .getState()
        .loadAssignmentsForCourse(mataKuliahId);
      // After loading, get the updated assignments
      const assignedDosens = getDosenByMataKuliah(mataKuliahId);
      setSelectedDosens(assignedDosens);
    } catch (error) {
      console.error("Error loading assignments:", error);
    }

    setShowDosenAssignmentPopup(true);
  };

  // Toggle dosen selection
  const toggleDosenSelection = (dosenId: string) => {
    setSelectedDosens((prev) => {
      if (prev.includes(dosenId)) {
        return prev.filter((id) => id !== dosenId);
      } else {
        return [...prev, dosenId];
      }
    });
  };

  // Save dosen assignments
  const saveDosenAssignments = () => {
    if (!currentMataKuliahId) return;

    // Get current assignments for this mata kuliah
    const currentAssignments = getDosenByMataKuliah(currentMataKuliahId);

    // Remove assignments that are no longer selected
    currentAssignments.forEach((dosenId) => {
      if (!selectedDosens.includes(dosenId)) {
        removeAssignment(dosenId, currentMataKuliahId);
      }
    });

    // Add new assignments
    selectedDosens.forEach((dosenId) => {
      if (!currentAssignments.includes(dosenId)) {
        addAssignment(dosenId, currentMataKuliahId);
      }
    });

    setShowDosenAssignmentPopup(false);
  };

  const handleDeleteClick = (id: string) => {
    setMataKuliahToDelete(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (mataKuliahToDelete) {
      setIsLoading(true);
      setError(null);

      try {
        // Delete via API
        await deleteMataKuliahAPI(mataKuliahToDelete);

        // Update local state
        deleteMataKuliah(mataKuliahToDelete);

        setDeleteModal(false);
        setMataKuliahToDelete(null);
      } catch (err) {
        setError("Gagal menghapus data mata kuliah");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal(false);
    setMataKuliahToDelete(null);
  };

  const filteredMataKuliah = mataKuliahList.filter(
    (mataKuliah) =>
      mataKuliah.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mataKuliah.kode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get dosen names for a mata kuliah
  const getDosenNamesForMataKuliah = (mataKuliahId: string) => {
    const dosenIds = getDosenByMataKuliah(mataKuliahId);
    return dosenIds
      .map((id) => {
        const dosen = dosenList.find((d) => d.id === id);
        return dosen ? dosen.nama : "";
      })
      .filter((name) => name !== "")
      .join(", ");
  };

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
        <FaSpinner className="animate-spin text-[#4F959D] text-xl" />
        <p className="text-gray-600">Memproses...</p>
      </div>
    </div>
  );

  // Error notification component
  const ErrorNotification = ({ message }: { message: string }) => (
    <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50">
      <div className="flex items-center">
        <FaExclamationTriangle className="mr-2" />
        <p>{message}</p>
      </div>
      <button
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        onClick={() => setError(null)}
      >
        &times;
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-full overflow-hidden p-2 sm:p-4 bg-[#F2F2F2]">
      {/* Loading indicator */}
      {isLoading && <LoadingIndicator />}

      {/* Error notification */}
      {error && <ErrorNotification message={error} />}

      {/* Header Section */}
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#2C3930]">
              Kelola <span className="text-[#4F959D]">Mata Kuliah</span>
            </h1>
            <p className="text-gray-600 mt-1 text-xs sm:text-sm">
              Mengelola data mata kuliah untuk sistem penjadwalan
            </p>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto md:space-x-3 gap-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari..."
                className="pl-8 pr-2 py-1.5 md:pl-10 md:pr-4 md:py-2 border border-white rounded-lg focus:outline-none ring-1 ring-gray-400 focus:ring-1 focus:ring-[#4F959D] w-full md:w-64 text-gray-600 text-sm md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-2.5 top-2.5 md:left-3 md:top-3 text-gray-400 text-xs md:text-base" />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#4F959D] text-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-lg hover:bg-[#3C7A85] transition flex items-center justify-center"
              disabled={isLoading}
            >
              <FaPlus className="mr-1" /> Tambah MK
            </button>
          </div>
        </div>
      </div>

      {/* Form Tambah Mata Kuliah (Collapsible) */}
      {showAddForm && (
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-4 transition-all duration-300">
          <h2 className="text-[#4F959D] text-base sm:text-lg font-semibold mb-3 flex items-center">
            <FaBook className="mr-2" /> Tambah Data Mata Kuliah
          </h2>

          <form className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                Kode Mata Kuliah
              </label>
              <input
                type="text"
                className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                placeholder="Masukkan kode mata kuliah"
                value={tempInput.kode}
                onChange={(e) =>
                  setTempInput({ ...tempInput, kode: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                Nama Mata Kuliah
              </label>
              <input
                type="text"
                className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                placeholder="Masukkan nama mata kuliah"
                value={tempInput.nama}
                onChange={(e) =>
                  setTempInput({ ...tempInput, nama: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                Semester
              </label>
              <select
                className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                value={tempInput.semester}
                onChange={(e) =>
                  setTempInput({ ...tempInput, semester: e.target.value })
                }
                disabled={isLoading}
              >
                <option value="">Pilih Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>
            <div>
              <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                SKS
              </label>
              <input
                type="number"
                className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                placeholder="Masukkan jumlah SKS"
                value={tempInput.sks}
                onChange={(e) =>
                  setTempInput({ ...tempInput, sks: e.target.value })
                }
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-start space-x-2">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-3 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowAddForm(false)}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="button"
                className="bg-[#4F959D] text-white px-3 py-1.5 text-xs sm:text-sm rounded-lg hover:bg-[#3C7A85] transition"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data Mata Kuliah */}
      <div className="bg-white p-2 sm:p-3 md:p-6 rounded-lg shadow-md">
        <h2 className="text-[#4F959D] text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center">
          <FaBook className="mr-1 sm:mr-2 text-xs sm:text-sm md:text-base" />{" "}
          Daftar Mata Kuliah
        </h2>

        {isLoading && mataKuliahList.length === 0 ? (
          <div className="py-4 sm:py-6 md:py-8 text-center">
            <FaSpinner className="animate-spin mx-auto text-lg sm:text-xl md:text-2xl text-[#4F959D] mb-1 sm:mb-2" />
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
              Memuat data mata kuliah...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm table-fixed">
              <thead>
                <tr className="bg-[#F5F5F5]">
                  <th className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-[5%] sm:w-[6%] md:w-[8%]">
                    No
                  </th>
                  <th className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-[10%] sm:w-[10%] md:w-[10%]">
                    Kode
                  </th>
                  <th className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-[25%] sm:w-[25%] md:w-[25%]">
                    Nama MK
                  </th>
                  <th className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-[5%] sm:w-[5%] md:w-[5%]">
                    Sem
                  </th>
                  <th className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-[5%] sm:w-[5%] md:w-[5%]">
                    SKS
                  </th>
                  <th className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-left font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-[35%] sm:w-[34%] md:w-[32%]">
                    Dosen Pengampu
                  </th>
                  <th className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-center font-semibold text-[#2C3930] border-b-2 border-[#4F959D] w-[15%] sm:w-[15%] md:w-[15%]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {filteredMataKuliah.length > 0 ? (
                  filteredMataKuliah.map((mataKuliah, index) => (
                    <tr
                      key={mataKuliah.id}
                      className="hover:bg-gray-50 border-b border-gray-200 transition-colors text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm"
                    >
                      <td className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2">
                        {index + 1}
                      </td>
                      <td className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2">
                        <div className="truncate">{mataKuliah.kode}</div>
                      </td>
                      <td className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 font-medium">
                        <div className="truncate max-w-[60px] xs:max-w-[80px] sm:max-w-[120px] md:max-w-[180px] lg:max-w-full">
                          {mataKuliah.nama}
                        </div>
                      </td>
                      <td className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-center">
                        {mataKuliah.semester}
                      </td>
                      <td className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-center">
                        {mataKuliah.sks}
                      </td>
                      <td className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2">
                        <div className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-full">
                          {getDosenNamesForMataKuliah(mataKuliah.id || "") || (
                            <span className="text-gray-400 italic">
                              Belum ada dosen
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2">
                        <div className="flex justify-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-colors p-0.5 sm:p-1"
                            onClick={() => handleEditClick(mataKuliah)}
                            title="Edit"
                            disabled={isLoading}
                          >
                            <FaEdit className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-800 transition-colors p-0.5 sm:p-1"
                            onClick={() =>
                              handleAssignDosen(mataKuliah.id || "")
                            }
                            title="Pilih Dosen"
                            disabled={!mataKuliah.id || isLoading}
                          >
                            <FaUserTie className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors p-0.5 sm:p-1"
                            onClick={() =>
                              handleDeleteClick(mataKuliah.id || "")
                            }
                            title="Hapus"
                            disabled={isLoading}
                          >
                            <FaTrash className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-1 sm:px-2 md:px-4 py-2 sm:py-3 md:py-4 text-center text-gray-500 bg-gray-50 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm"
                    >
                      {searchTerm
                        ? "Tidak ada hasil yang sesuai dengan pencarian"
                        : "Belum ada data mata kuliah"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer with Stats */}
        <div className="mt-3 text-xs text-gray-600 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1">
          <div>
            Total:{" "}
            <span className="font-medium">{filteredMataKuliah.length}</span>{" "}
            mata kuliah
          </div>
          {searchTerm && (
            <div className="truncate max-w-full">
              Hasil pencarian:{" "}
              <span className="font-medium">&quot;{searchTerm}&quot;</span>
            </div>
          )}
        </div>
      </div>

      {/* Popup Edit */}
      {editPopup && selectedMataKuliah && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-2 z-50">
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm animate-fadeIn">
            <h2 className="text-[#4F959D] text-base sm:text-lg font-semibold mb-3 flex items-center">
              <FaBook className="mr-2" /> Edit Data Mata Kuliah
            </h2>

            <form className="space-y-3">
              <div>
                <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                  Kode Mata Kuliah
                </label>
                <input
                  type="text"
                  className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedMataKuliah.kode}
                  onChange={(e) =>
                    setSelectedMataKuliah({
                      ...selectedMataKuliah,
                      kode: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                  Nama Mata Kuliah
                </label>
                <input
                  type="text"
                  className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedMataKuliah.nama}
                  onChange={(e) =>
                    setSelectedMataKuliah({
                      ...selectedMataKuliah,
                      nama: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                  Semester
                </label>
                <select
                  className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedMataKuliah.semester}
                  onChange={(e) =>
                    setSelectedMataKuliah({
                      ...selectedMataKuliah,
                      semester: e.target.value,
                    })
                  }
                  disabled={isLoading}
                >
                  <option value="">Pilih Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>
              <div>
                <label className="block text-[#4F959D] text-xs sm:text-sm font-medium mb-1">
                  SKS
                </label>
                <input
                  type="number"
                  className="w-full p-2 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F959D] placeholder-gray-400 text-black"
                  value={selectedMataKuliah.sks}
                  onChange={(e) =>
                    setSelectedMataKuliah({
                      ...selectedMataKuliah,
                      sks: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-3 py-1.5 text-xs sm:text-sm w-1/2 rounded-lg hover:bg-gray-400 transition"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="bg-[#4F959D] text-white px-3 py-1.5 text-xs sm:text-sm w-1/2 rounded-lg hover:bg-[#3C7A85] transition"
                  onClick={handleConfirmEdit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Popup Assign Dosen */}
      {showDosenAssignmentPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-2 z-50">
          <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
            <h2 className="text-[#4F959D] text-base sm:text-lg font-semibold mb-3 flex items-center">
              <FaUserTie className="mr-2" /> Pilih Dosen Pengampu
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Mata Kuliah:{" "}
                <span className="font-medium">
                  {mataKuliahList.find((mk) => mk.id === currentMataKuliahId)
                    ?.nama || ""}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Pilih dosen yang akan mengajar mata kuliah ini
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
              {dosenList.length > 0 ? (
                dosenList.map((dosen) => (
                  <div
                    key={dosen.id}
                    className={`p-3 flex items-center hover:bg-gray-50 cursor-pointer ${
                      selectedDosens.includes(dosen.id || "")
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => toggleDosenSelection(dosen.id || "")}
                  >
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                        selectedDosens.includes(dosen.id || "")
                          ? "bg-[#4F959D] border-[#4F959D]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedDosens.includes(dosen.id || "") && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{dosen.nama}</p>
                      <p className="text-xs text-gray-500">NIP: {dosen.nip}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Belum ada data dosen. Silakan tambahkan dosen terlebih dahulu.
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-3 py-2 text-sm w-1/2 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowDosenAssignmentPopup(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="bg-[#4F959D] text-white px-3 py-2 text-sm w-1/2 rounded-lg hover:bg-[#3C7A85] transition"
                onClick={saveDosenAssignments}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus mata kuliah ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Menghapus...
                  </span>
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaMataKuliah;
