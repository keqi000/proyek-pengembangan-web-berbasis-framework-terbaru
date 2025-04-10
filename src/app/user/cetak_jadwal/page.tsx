"use client";

import { FC, useState, useRef } from "react";
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
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
};

const CetakJadwalPage: FC = () => {
  // Mock data for demonstration
  const [jadwalData, setJadwalData] = useState<JadwalItem[]>([
    {
      id: "1",
      hari: "Senin",
      jamMulai: "08:00",
      jamSelesai: "10:00",
      mataKuliah: "Pemrograman Web",
      namaDosen: "Dr. Budi Santoso, M.Kom.",
      ruangan: "Lab Komputer 2",
      jenisKuliah: "Tatap Muka",
      selected: true,
    },
    {
      id: "2",
      hari: "Senin",
      jamMulai: "13:00",
      jamSelesai: "15:00",
      mataKuliah: "Basis Data Lanjut",
      namaDosen: "Dr. Siti Aminah, M.Sc.",
      ruangan: "Ruang 301",
      jenisKuliah: "Tatap Muka",
      selected: true,
    },
    {
      id: "3",
      hari: "Selasa",
      jamMulai: "09:00",
      jamSelesai: "11:30",
      mataKuliah: "Kecerdasan Buatan",
      namaDosen: "Prof. Ahmad Wijaya, Ph.D.",
      ruangan: "Online",
      jenisKuliah: "Online",
      selected: true,
    },
    {
      id: "4",
      hari: "Rabu",
      jamMulai: "10:00",
      jamSelesai: "12:00",
      mataKuliah: "Jaringan Komputer",
      namaDosen: "Dr. Rini Puspita, M.T.",
      ruangan: "Lab Jaringan",
      jenisKuliah: "Hybrid",
      selected: true,
    },
    {
      id: "5",
      hari: "Kamis",
      jamMulai: "13:00",
      jamSelesai: "15:00",
      mataKuliah: "Pengembangan Aplikasi Mobile",
      namaDosen: "Dr. Hadi Prasetyo, M.Kom.",
      ruangan: "Lab Mobile",
      jenisKuliah: "Tatap Muka",
      selected: true,
    },
    {
      id: "6",
      hari: "Jumat",
      jamMulai: "08:00",
      jamSelesai: "10:00",
      mataKuliah: "Keamanan Sistem Informasi",
      namaDosen: "Dr. Eko Nugroho, M.Sc.",
      ruangan: "Ruang 201",
      jenisKuliah: "Tatap Muka",
      selected: true,
    },
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [shareOptions, setShareOptions] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

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

  // Handle print functionality - fixed implementation
  const handlePrint = useReactToPrint({
    documentTitle: "Jadwal Kuliah - Yonathan Hot Gabe Sihotang",
    onAfterPrint: () => console.log("Printed successfully!"),
    contentRef: printRef,
  });

  // Function to download as PDF using jsPDF and html2canvas
  // Alternative PDF generation approach
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
      body { font-family: Arial, sans-serif; }
      table { width: 100%; border-collapse: collapse; }
      th { background-color: #2C3930; color: white; padding: 8px; text-align: left; }
      td { padding: 8px; border-bottom: 1px solid #ddd; }
      tr:nth-child(even) { background-color: #f2f2f2; }
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Selection Options */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold text-[#2C3930] mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Pilih Jadwal
            </h2>

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

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {jadwalData.map((jadwal) => (
                <div
                  key={jadwal.id}
                  className={`p-3 rounded-md border ${
                    jadwal.selected
                      ? "border-[#A27B5C] bg-[#DCD7C9]/30"
                      : "border-gray-200"
                  } cursor-pointer hover:bg-gray-50 transition`}
                  onClick={() => toggleSelection(jadwal.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={jadwal.selected}
                      onChange={() => toggleSelection(jadwal.id)}
                      className="h-4 w-4 text-[#A27B5C] border-gray-300 rounded focus:ring-[#A27B5C]"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-800">
                        {jadwal.mataKuliah}
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        <span>{jadwal.hari}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-[#2C3930] mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Opsi Cetak
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setShowPreview(true)}
                className="w-full py-2.5 px-4 bg-[#4F959D] text-white rounded-md flex items-center justify-center hover:bg-[#3F7F87] transition"
                disabled={selectedJadwal.length === 0}
              >
                <Eye className="w-5 h-5 mr-2" />
                Pratinjau Jadwal
              </button>

              <button
                onClick={(e) => handlePrint()}
                className="w-full py-2.5 px-4 bg-[#2C3930] text-white rounded-md flex items-center justify-center hover:bg-[#3F4F44] transition"
                disabled={selectedJadwal.length === 0}
              >
                <Printer className="w-5 h-5 mr-2" />
                Cetak Jadwal
              </button>

              <button
                onClick={handleDownloadPDF}
                className="w-full py-2.5 px-4 bg-[#A27B5C] text-white rounded-md flex items-center justify-center hover:bg-[#8A6A4F] transition"
                disabled={selectedJadwal.length === 0 || isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Menyiapkan PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Unduh PDF
                  </>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShareOptions(!shareOptions)}
                  className="w-full py-2.5 px-4 bg-gray-200 text-gray-700 rounded-md flex items-center justify-center hover:bg-gray-300 transition"
                  disabled={selectedJadwal.length === 0}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Bagikan
                </button>

                {shareOptions && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="p-2 space-y-1">
                      <button className="w-full py-2 px-3 text-left rounded-md hover:bg-gray-100 flex items-center text-gray-700">
                        <Mail className="w-4 h-4 mr-2" />
                        Kirim via Email
                      </button>
                      <button className="w-full py-2 px-3 text-left rounded-md hover:bg-gray-100 flex items-center text-gray-700">
                        <Save className="w-4 h-4 mr-2" />
                        Simpan ke Drive
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#2C3930] flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Pratinjau Jadwal
              </h2>
              <span className="text-sm text-gray-500">
                {selectedJadwal.length} mata kuliah dipilih
              </span>
            </div>

            {/* Print Preview Area */}
            <div
              className={`border border-gray-200 rounded-md p-4 ${
                selectedJadwal.length === 0
                  ? "flex items-center justify-center h-[500px]"
                  : ""
              }`}
            >
              {selectedJadwal.length === 0 ? (
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    Tidak ada jadwal dipilih
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Silakan pilih jadwal yang ingin dicetak dari panel sebelah
                    kiri
                  </p>
                </div>
              ) : (
                <div ref={printRef} className="print-container">
                  {/* Print Header */}
                  <div className="text-center mb-6 print:mb-4">
                    <h1 className="text-2xl font-bold text-[#2C3930] mb-1 font-bebas">
                      JADWAL KULIAH
                    </h1>
                    <p className="text-gray-600">Yonathan Hot Gabe Sihotang</p>
                    <p className="text-gray-500 text-sm">
                      Semester Genap 2024/2025
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Dicetak pada:{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Jadwal Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-[#2C3930] text-gray-600">
                      <thead>
                        <tr className="bg-[#2C3930] text-white">
                          <th className="py-2 px-3 text-left">Hari</th>
                          <th className="py-2 px-3 text-left">Waktu</th>
                          <th className="py-2 px-3 text-left">Mata Kuliah</th>
                          <th className="py-2 px-3 text-left">Dosen</th>
                          <th className="py-2 px-3 text-left">Ruangan</th>
                          <th className="py-2 px-3 text-left">Jenis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {days.map((day) => {
                          const dayJadwal = selectedJadwal.filter(
                            (jadwal) => jadwal.hari === day
                          );

                          if (dayJadwal.length === 0) return null;

                          return dayJadwal.map((jadwal, index) => (
                            <tr
                              key={jadwal.id}
                              className={`${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              } border-b border-gray-200 hover:bg-gray-100`}
                            >
                              <td className="py-3 px-3">
                                <div className="font-medium">{jadwal.hari}</div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 text-[#A27B5C] mr-1" />
                                  <span>
                                    {jadwal.jamMulai} - {jadwal.jamSelesai}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-medium">
                                  {jadwal.mataKuliah}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center">
                                  <User className="w-4 h-4 text-[#A27B5C] mr-1" />
                                  <span>{jadwal.namaDosen}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 text-[#A27B5C] mr-1" />
                                  <span>{jadwal.ruangan}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJenisKuliahColor(
                                    jadwal.jenisKuliah
                                  )}`}
                                >
                                  {getJenisKuliahIcon(jadwal.jenisKuliah)}
                                  {jadwal.jenisKuliah}
                                </span>
                              </td>
                            </tr>
                          ));
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 text-sm text-gray-500 border-t border-gray-200 pt-4">
                    <p className="mb-1">
                      <span className="font-medium">Catatan:</span>
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Jadwal dapat berubah sewaktu-waktu. Silakan periksa
                        secara berkala.
                      </li>
                      <li>
                        Untuk kelas online, tautan akan dikirimkan melalui email
                        atau platform pembelajaran.
                      </li>
                      <li>Harap hadir tepat waktu untuk semua perkuliahan.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal for full preview */}
            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-[#2C3930]">
                      Pratinjau Jadwal Lengkap
                    </h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6">
                    {/* Clone of the print content */}
                    <div className="print-preview">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-[#2C3930] mb-1 font-bebas">
                          JADWAL KULIAH
                        </h1>
                        <p className="text-gray-600">
                          Yonathan Hot Gabe Sihotang
                        </p>
                        <p className="text-gray-500 text-sm">
                          Semester Genap 2024/2025
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Dicetak pada:{" "}
                          {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Jadwal Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-gray-600">
                          <thead>
                            <tr className="bg-[#2C3930] text-white">
                              <th className="py-2 px-3 text-left">Hari</th>
                              <th className="py-2 px-3 text-left">Waktu</th>
                              <th className="py-2 px-3 text-left">
                                Mata Kuliah
                              </th>
                              <th className="py-2 px-3 text-left">Dosen</th>
                              <th className="py-2 px-3 text-left">Ruangan</th>
                              <th className="py-2 px-3 text-left">Jenis</th>
                            </tr>
                          </thead>
                          <tbody>
                            {days.map((day) => {
                              const dayJadwal = selectedJadwal.filter(
                                (jadwal) => jadwal.hari === day
                              );

                              if (dayJadwal.length === 0) return null;

                              return dayJadwal.map((jadwal, index) => (
                                <tr
                                  key={jadwal.id}
                                  className={`${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  } border-b border-gray-200`}
                                >
                                  <td className="py-3 px-3">
                                    <div className="font-medium">
                                      {jadwal.hari}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="flex items-center">
                                      <Clock className="w-4 h-4 text-[#A27B5C] mr-1" />
                                      <span>
                                        {jadwal.jamMulai} - {jadwal.jamSelesai}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="font-medium">
                                      {jadwal.mataKuliah}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="flex items-center">
                                      <User className="w-4 h-4 text-[#A27B5C] mr-1" />
                                      <span>{jadwal.namaDosen}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 text-[#A27B5C] mr-1" />
                                      <span>{jadwal.ruangan}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJenisKuliahColor(
                                        jadwal.jenisKuliah
                                      )}`}
                                    >
                                      {getJenisKuliahIcon(jadwal.jenisKuliah)}
                                      {jadwal.jenisKuliah}
                                    </span>
                                  </td>
                                </tr>
                              ));
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 text-sm text-gray-500 border-t border-gray-200 pt-4">
                        <p className="mb-1">
                          <span className="font-medium">Catatan:</span>
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            Jadwal dapat berubah sewaktu-waktu. Silakan periksa
                            secara berkala.
                          </li>
                          <li>
                            Untuk kelas online, tautan akan dikirimkan melalui
                            email atau platform pembelajaran.
                          </li>
                          <li>
                            Harap hadir tepat waktu untuk semua perkuliahan.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                      Tutup
                    </button>
                    <button
                      onClick={() => handlePrint()}
                      className="px-4 py-2 bg-[#2C3930] text-white rounded-md flex items-center hover:bg-[#3F4F44] transition"
                    >
                      <Printer className="w-5 h-5 mr-2" />
                      Cetak
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="px-4 py-2 bg-[#A27B5C] text-white rounded-md flex items-center hover:bg-[#8A6A4F] transition"
                      disabled={isGeneratingPDF}
                    >
                      {isGeneratingPDF ? (
                        <>
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                          Menyiapkan...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Unduh PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CetakJadwalPage;
