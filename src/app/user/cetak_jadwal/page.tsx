"use client";

import { FC, useState, useRef, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Printer,
  Download,
  Eye,
  Mail,
  Share2,
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Save,
  CheckSquare,
  Filter,
  FileText,
  Info,
  Loader,
} from "lucide-react";
import {
  getStudentSchedule,
  // ScheduleItem,
} from "../../services/studentSchedule";

type JadwalItem = {
  id: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataKuliah: string;
  namaDosen: string;
  ruangan: string;
  jenisKuliah: "Tatap Muka" | "Online" | "Hybrid";
  selected?: boolean;
  kode?: string;
  semester?: string;
};

const CetakJadwalPage: FC = () => {
  const [jadwalData, setJadwalData] = useState<JadwalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [shareOptions, setShareOptions] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

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

  const loadScheduleData = useCallback(async (userId: string) => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current || !isMountedRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log("Loading schedule for user:", userId);
      const schedules = await getStudentSchedule(userId);

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        console.log("Fetched schedules:", schedules);

        // Transform schedules to match JadwalItem format
        const transformedSchedules: JadwalItem[] = schedules.map((schedule) => {
          const [jamMulai, jamSelesai] = schedule.waktu.split(" - ");
          return {
            id: schedule.id,
            hari: schedule.hari,
            jamMulai: jamMulai || "00:00",
            jamSelesai: jamSelesai || "00:00",
            mataKuliah: schedule.mataKuliah,
            namaDosen: schedule.namaDosen,
            ruangan: schedule.ruangan,
            jenisKuliah: "Tatap Muka" as const, // Default to Tatap Muka
            selected: true, // Default all to selected
            kode: schedule.kode,
            semester: schedule.semester,
          };
        });

        setJadwalData(transformedSchedules);
        setDataLoaded(true);
        hasInitializedRef.current = true;
      }
    } catch (err) {
      console.error("Error loading schedule:", err);
      if (isMountedRef.current) {
        setError("Gagal memuat jadwal kuliah");
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
      console.log("Initial schedule load for user:", user.id);
      loadScheduleData(user.id);
    } else if (!user || user.role !== "mahasiswa") {
      setLoading(false);
      setDataLoaded(true);
    }
  }, [user, loadScheduleData]);

  // Toggle selection of a jadwal item
  const toggleSelection = (id: string) => {
    setJadwalData(
      jadwalData.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Select or deselect all jadwal items
  const toggleSelectAll = (select: boolean) => {
    setJadwalData(jadwalData.map((item) => ({ ...item, selected: select })));
  };

  // Handle print functionality - FIXED
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Jadwal Kuliah - " + (user?.name || "Mahasiswa"),
    onAfterPrint: () => console.log("Printed successfully!"),
  });

  // Function to download as PDF
  const handleDownloadPDF = () => {
    if (!printRef.current) return;

    try {
      setIsGeneratingPDF(true);

      // Use the print functionality to generate a PDF
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Popup blocked. Please allow popups for this website.");
        setIsGeneratingPDF(false);
        return;
      }

      printWindow.document.write("<html><head><title>Jadwal Kuliah</title>");
      printWindow.document.write("<style>");
      printWindow.document.write(`
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #2C3930; color: white; padding: 8px; text-align: left; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 30px; }
        .day-section { margin-bottom: 30px; }
        .day-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #2C3930; padding-bottom: 5px; }
      `);
      printWindow.document.write("</style>");
      printWindow.document.write("</head><body>");

      // Clone the content
      if (printRef.current) {
        printWindow.document.write(printRef.current.innerHTML);
      }

      printWindow.document.write("</body></html>");
      printWindow.document.close();

      // Wait for content to load
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
          setIsGeneratingPDF(false);
        };
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat mengunduh PDF. Silakan coba lagi.");
      setIsGeneratingPDF(false);
    }
  };

  // Get color based on jenis kuliah
  const getJenisKuliahColor = (jenis: string) => {
    switch (jenis) {
      case "Tatap Muka":
        return "bg-green-100 text-green-800";
      case "Online":
        return "bg-blue-100 text-blue-800";
      case "Hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get icon based on jenis kuliah
  const getJenisKuliahIcon = (jenis: string) => {
    switch (jenis) {
      case "Tatap Muka":
        return <MapPin className="w-4 h-4 mr-1" />;
      case "Online":
        return <BookOpen className="w-4 h-4 mr-1" />;
      case "Hybrid":
        return <Info className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  // Selected jadwal items
  const selectedJadwal = jadwalData.filter((item) => item.selected);

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

  return (
    <div className="py-8 px-4 md:px-8 bg-gray-100">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2 font-bebas">
          CETAK <span className="text-[#A27B5C]">JADWAL</span>
        </h1>
        <p className="text-gray-700 font-poppins">
          Cetak atau unduh jadwal kuliah Anda dalam format PDF untuk referensi
          offline.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {shouldShowLoading && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center py-8">
            <Loader
              className="animate-spin mx-auto text-2xl text-[#4F959D] mb-2"
              size={32}
            />
            <p className="text-gray-500">Memuat jadwal kuliah...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {shouldShowContent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Selection Options */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-xl font-semibold text-[#2C3930] mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Pilih Jadwal
              </h2>

              {jadwalData.length > 0 && (
                <>
                  <div className="flex justify-between mb-4">
                    <button
                      onClick={() => toggleSelectAll(true)}
                      className="px-3 py-1.5 bg-[#2C3930] text-white rounded-md text-sm flex items-center hover:bg-[#3F4F44] transition"
                    >
                      <CheckSquare className="w-4 h-4 mr-1" />
                      Pilih Semua
                    </button>
                    <button
                      onClick={() => toggleSelectAll(false)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm flex items-center hover:bg-gray-300 transition"
                    >
                      Hapus Semua
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {jadwalData.map((jadwal) => (
                      <div
                        key={jadwal.id}
                        className={`p-3 border rounded-lg cursor-pointer transition ${
                          jadwal.selected
                            ? "border-[#4F959D] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleSelection(jadwal.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-[#2C3930]">
                              {jadwal.mataKuliah}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {jadwal.hari} • {jadwal.jamMulai} -{" "}
                              {jadwal.jamSelesai}
                            </p>
                            <p className="text-xs text-gray-500">
                              {jadwal.namaDosen} • {jadwal.ruangan}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={jadwal.selected}
                            onChange={() => toggleSelection(jadwal.id)}
                            className="ml-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>{selectedJadwal.length}</strong> dari{" "}
                      <strong>{jadwalData.length}</strong> jadwal dipilih
                    </p>
                  </div>
                </>
              )}

              {jadwalData.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm">Tidak ada jadwal tersedia</p>
                  <p className="text-xs mt-1">
                    Silakan daftar mata kuliah terlebih dahulu
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {jadwalData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-[#2C3930] mb-4">
                  Aksi Cetak
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition"
                    disabled={selectedJadwal.length === 0}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? "Sembunyikan" : "Tampilkan"} Preview
                  </button>

                  <button
                    onClick={() => handlePrint()}
                    className="w-full px-4 py-2 bg-[#2C3930] text-white rounded-md flex items-center justify-center hover:bg-[#3F4F44] transition"
                    disabled={selectedJadwal.length === 0}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Jadwal
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md flex items-center justify-center hover:bg-green-700 transition"
                    disabled={selectedJadwal.length === 0 || isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {isGeneratingPDF ? "Mengunduh..." : "Unduh PDF"}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShareOptions(!shareOptions)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-md flex items-center justify-center hover:bg-purple-700 transition"
                      disabled={selectedJadwal.length === 0}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Bagikan
                    </button>

                    {shareOptions && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link berhasil disalin!");
                            setShareOptions(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Salin Link
                        </button>
                        <button
                          onClick={() => {
                            const subject = "Jadwal Kuliah";
                            const body = `Berikut jadwal kuliah saya:\n\n${selectedJadwal
                              .map(
                                (j) =>
                                  `${j.hari}: ${j.mataKuliah} (${j.jamMulai}-${j.jamSelesai}) - ${j.ruangan}`
                              )
                              .join("\n")}`;
                            window.open(
                              `mailto:?subject=${encodeURIComponent(
                                subject
                              )}&body=${encodeURIComponent(body)}`
                            );
                            setShareOptions(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Kirim Email
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            {showPreview && selectedJadwal.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#2C3930]">
                    Preview Jadwal
                  </h2>
                  <span className="text-sm text-gray-500">
                    {selectedJadwal.length} jadwal dipilih
                  </span>
                </div>

                {/* Printable Content */}
                <div ref={printRef} className="print-content">
                  {/* Header for Print */}
                  <div className="print-header mb-6">
                    <div className="text-center border-b-2 border-[#2C3930] pb-4">
                      <h1 className="text-2xl font-bold text-[#2C3930] mb-2">
                        JADWAL KULIAH
                      </h1>
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Nama:</strong> {user?.name || "Mahasiswa"}
                        </p>
                        <p>
                          <strong>NIM:</strong>{" "}
                          {user?.nim || user?.username || "-"}
                        </p>
                        <p>
                          <strong>Tanggal Cetak:</strong>{" "}
                          {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule by Day */}
                  <div className="space-y-6">
                    {days.map((day) => {
                      const daySchedules = selectedJadwal.filter(
                        (jadwal) => jadwal.hari === day
                      );

                      if (daySchedules.length === 0) return null;

                      return (
                        <div key={day} className="day-section">
                          <h3 className="text-lg font-semibold text-[#2C3930] mb-3 border-b border-gray-300 pb-1">
                            {day}
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-[#2C3930] text-white">
                                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">
                                    Waktu
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">
                                    Mata Kuliah
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">
                                    Dosen
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">
                                    Ruangan
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-left text-sm">
                                    Jenis
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {daySchedules
                                  .sort((a, b) =>
                                    a.jamMulai.localeCompare(b.jamMulai)
                                  )
                                  .map((jadwal, index) => (
                                    <tr
                                      key={jadwal.id}
                                      className={
                                        index % 2 === 0
                                          ? "bg-gray-50"
                                          : "bg-white"
                                      }
                                    >
                                      <td className="border border-gray-300 px-3 py-2 text-sm">
                                        <div className="flex items-center text-black">
                                          <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                          {jadwal.jamMulai} -{" "}
                                          {jadwal.jamSelesai}
                                        </div>
                                      </td>
                                      <td className="border border-gray-300 px-3 py-2 text-sm">
                                        <div>
                                          <div className="font-medium text-[#2C3930]">
                                            {jadwal.mataKuliah}
                                          </div>
                                          {jadwal.kode && (
                                            <div className="text-xs text-gray-500">
                                              {jadwal.kode}
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                      <td className="border border-gray-300 px-3 py-2 text-sm text-black">
                                        <div className="flex items-center">
                                          <User className="w-4 h-4 mr-1 text-gray-500" />
                                          {jadwal.namaDosen}
                                        </div>
                                      </td>
                                      <td className="border border-gray-300 px-3 py-2 text-sm text-black">
                                        <div className="flex items-center">
                                          <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                                          {jadwal.ruangan}
                                        </div>
                                      </td>
                                      <td className="border border-gray-300 px-3 py-2 text-sm">
                                        <span
                                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getJenisKuliahColor(
                                            jadwal.jenisKuliah
                                          )}`}
                                        >
                                          {getJenisKuliahIcon(
                                            jadwal.jenisKuliah
                                          )}
                                          {jadwal.jenisKuliah}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 pt-4 border-t border-gray-300">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {selectedJadwal.length}
                        </div>
                        <div className="text-xs text-gray-600">
                          Total Jadwal
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {
                            new Set(selectedJadwal.map((j) => j.mataKuliah))
                              .size
                          }
                        </div>
                        <div className="text-xs text-gray-600">Mata Kuliah</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          {new Set(selectedJadwal.map((j) => j.namaDosen)).size}
                        </div>
                        <div className="text-xs text-gray-600">Dosen</div>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-amber-600">
                          {new Set(selectedJadwal.map((j) => j.hari)).size}
                        </div>
                        <div className="text-xs text-gray-600">Hari Aktif</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer for Print */}
                  <div className="print-footer mt-6 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                    <p>
                      Dicetak pada {new Date().toLocaleDateString("id-ID")}{" "}
                      pukul {new Date().toLocaleTimeString("id-ID")}
                    </p>
                    <p className="mt-1">
                      Sistem Penjadwalan Perkuliahan - Universitas
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State when no preview */}
            {!showPreview && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center text-gray-500">
                  <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-lg font-medium mb-2">Preview Jadwal</h3>
                  <p className="text-sm mb-4">
                    Pilih jadwal yang ingin dicetak dan klik "Tampilkan Preview"
                    untuk melihat hasil cetak.
                  </p>
                  {selectedJadwal.length > 0 && (
                    <button
                      onClick={() => setShowPreview(true)}
                      className="px-4 py-2 bg-[#4F959D] text-white rounded-md hover:bg-[#6AABB3] transition"
                    >
                      Tampilkan Preview
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* No Schedule Available */}
            {jadwalData.length === 0 && shouldShowContent && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center text-gray-500">
                  <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="text-lg font-medium mb-2">Tidak Ada Jadwal</h3>
                  <p className="text-sm mb-4">
                    Anda belum memiliki jadwal kuliah yang dapat dicetak.
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Silakan daftar mata kuliah terlebih dahulu di halaman{" "}
                    <a
                      href="/user/course"
                      className="text-[#4F959D] hover:underline"
                    >
                      Mata Kuliah
                    </a>
                  </p>
                  <a
                    href="/user/course"
                    className="inline-flex items-center px-4 py-2 bg-[#4F959D] text-white rounded-md hover:bg-[#6AABB3] transition"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Daftar Mata Kuliah
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          .print-content,
          .print-content * {
            visibility: visible;
          }

          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            font-size: 12px;
            line-height: 1.4;
          }

          .print-header {
            margin-bottom: 20px;
          }

          .day-section {
            page-break-inside: avoid;
            margin-bottom: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }

          th,
          td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }

          th {
            background-color: #2c3930 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .print-footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #333;
            text-align: center;
            font-size: 10px;
          }

          /* Hide icons in print */
          .lucide {
            display: none;
          }

          /* Ensure colors print correctly */
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        /* Screen styles for better preview */
        .print-content {
          max-width: 100%;
          margin: 0 auto;
        }

        .print-content table {
          font-size: 14px;
        }

        .print-content th,
        .print-content td {
          padding: 12px 8px;
        }

        @media (max-width: 768px) {
          .print-content {
            font-size: 12px;
          }

          .print-content table {
            font-size: 11px;
          }

          .print-content th,
          .print-content td {
            padding: 8px 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default CetakJadwalPage;
