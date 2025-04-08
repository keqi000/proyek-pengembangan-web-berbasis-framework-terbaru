"use client";

import { ReactNode, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/admin/admin_component/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/admin/admin_component/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/admin/admin_component/tabs";
import {
  HelpCircle,
  BookOpen,
  Calendar,
  Users,
  Building,
  Search,
} from "lucide-react";
import NavigationBar from "../admin_component/Navbar";

type QuestionItemData = {
  title: string;
  content: string;
}

type CardSectionProp = {
  title: string;
  description: string;
  questionData: QuestionItemData[];
  icon: ReactNode
}

// TODO: just make this data into JSON maybe?
const cardSectionData: CardSectionProp[] = [{
  title: "Penjadwalan",
  description: "Pertanyaan umum tentang penjadwalan",
  icon: <Calendar className="h-5 w-5 text-[#4F959D]" />,
  questionData: [{
    title: "Bagaimana cara generate jadwal?",
    content: `
      Untuk generate jadwal, navigasi ke menu "Generate
      Jadwal", pilih semester dan tahun ajaran, kemudian
      klik tombol "Generate Jadwal". Sistem akan otomatis
      membuat jadwal berdasarkan data dosen, mata kuliah,
      dan ruangan yang tersedia.
    `
  }, {
    title: "Bagaimana jika terjadi bentrok jadwal?",
    content: `
      Sistem dirancang untuk menghindari bentrok jadwal.
      Namun jika terjadi, sistem akan memberikan notifikasi
      dan Anda dapat melakukan penyesuaian manual pada
      jadwal yang bentrok.
    `
  }, {
    title: "Apakah jadwal dapat diedit setelah digenerate?",
    content: `
      Ya, jadwal yang sudah digenerate dapat diedit secara
      manual. Anda dapat mengubah waktu, ruangan, atau dosen
      untuk menyesuaikan kebutuhan.
    `
  }],
}, {
  title: "Pengelolaan Dosen",
  description: "Pertanyaan tentang manajemen data dosen",
  icon: <Users className="h-5 w-5 text-[#4F959D]" />,
  questionData: [{
    title: "Bagaimana cara menambahkan dosen baru?",
    content: `
      Navigasi ke menu "Kelola Dosen", klik tombol "Tambah
      Dosen", isi formulir dengan data dosen yang diperlukan
      seperti nama, NIP, bidang keahlian, dan preferensi
      waktu mengajar, kemudian klik "Simpan".
    `
  }, {
    title: "Bagaimana cara mengatur preferensi waktu dosen?",
    content: `
      Pada halaman detail dosen, Anda dapat mengatur
      preferensi waktu mengajar dengan memilih hari dan jam
      yang tersedia. Sistem akan memprioritaskan preferensi
      ini saat generate jadwal.
    `
  }, {
    title: 'Bagaimana jika dosen tidak tersedia pada waktu tertentu?',
    content: `
      Anda dapat menandai waktu tidak tersedia pada
      preferensi dosen. Sistem tidak akan menjadwalkan dosen
      tersebut pada waktu yang ditandai tidak tersedia.
    `
  }]
}, {
  title: 'Mata Kuliah',
  description: 'Pertanyaan tentang pengelolaan mata kuliah',
  icon: <BookOpen className="h-5 w-5 text-[#4F959D]" />,
  questionData: [{
    title: "Bagaimana cara menambahkan mata kuliah baru?",
    content: `
      Navigasi ke menu "Kelola Mata Kuliah", klik tombol
      "Tambah Mata Kuliah", isi formulir dengan data yang
      diperlukan seperti kode, nama, SKS, dan prasyarat,
      kemudian klik "Simpan".
    `
  }, {
    title: "Bagaimana cara mengatur dosen pengampu mata kuliah?",
    content: `
      Pada halaman detail mata kuliah, Anda dapat
      menambahkan dosen pengampu dengan memilih dari daftar
      dosen yang tersedia. Satu mata kuliah dapat memiliki
      beberapa dosen pengampu.
    `
  }, {
    title: "Bagaimana cara mengatur prasyarat mata kuliah?",
    content: `
      Pada halaman edit mata kuliah, Anda dapat menambahkan
      prasyarat dengan memilih mata kuliah lain yang menjadi
      prasyarat. Sistem akan mempertimbangkan prasyarat ini
      saat generate jadwal.
    `
  }]
}, {
  title: "Ruangan",
  description: "Pertanyaan tentang pengelolaan ruangan",
  icon: <Building className="h-5 w-5 text-[#4F959D]" />,
  questionData: [{
    title: "Bagaimana cara menambahkan ruangan baru?",
    content: `
      Navigasi ke menu "Kelola Ruangan", klik tombol "Tambah
      Ruangan", isi formulir dengan data yang diperlukan
      seperti kode ruangan, kapasitas, dan fasilitas,
      kemudian klik "Simpan".
    `
  }, {
    title: "Bagaimana cara mengatur ketersediaan ruangan?",
    content: `
      Pada halaman detail ruangan, Anda dapat mengatur
      ketersediaan ruangan dengan menandai waktu yang
      tersedia. Sistem akan memperhitungkan ketersediaan ini
      saat generate jadwal.
    `
  }, {
    title: "Bagaimana jika ruangan sedang dalam perbaikan?",
    content: `
      Anda dapat menandai ruangan sebagai "Tidak Tersedia"
      atau "Dalam Perbaikan" pada halaman edit ruangan.
      Ruangan yang ditandai tidak akan digunakan dalam
      penjadwalan.
    `
  }]
}]

function CardSection({title, description, icon, questionData}: CardSectionProp){
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-black">
          {" "}
          {/* Changed text color */}
          {/* <Calendar className="h-5 w-5 text-[#4F959D]" /> */}
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-black">
          {description}
        </CardDescription>{" "}
        {/* Changed text color */}
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {questionData.map((item, index) => (
            <AccordionItem key={`card-${title}-accordion-${index}`} value={`item-${index}`}>
              <AccordionTrigger className="text-black">
                {item.title}
              </AccordionTrigger>{" "}
              {/* Changed text color */}
              <AccordionContent className="text-black">
                {" "}
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
          
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default function HelpPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const userName = "Admin"; // This should be replaced with actual user data

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
      />

      <div className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-6 max-w-5xl mx-auto lg:mx-auto lg:pr-64">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-black">Pusat Bantuan</h1>
            <p className="text-black mt-2">
              Temukan panduan dan jawaban untuk pertanyaan umum tentang Sistem
              Penjadwalan Perkuliahan
            </p>
          </div>
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="mb-6 mx-auto flex justify-center">
              <TabsTrigger
                value="faq"
                className="flex items-center gap-2 text-black"
              >
                <HelpCircle size={16} />
                <span>FAQ</span>
              </TabsTrigger>
              <TabsTrigger
                value="guides"
                className="flex items-center gap-2 text-black"
              >
                <BookOpen size={16} />
                <span>Panduan Penggunaan</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq">
              <div className="grid gap-6 md:grid-cols-2">
                {cardSectionData.map((item, index) => (
                  <CardSection 
                    key={`card-${index}`}
                    title={item.title} 
                    description={item.description}
                    icon={item.icon}
                    questionData={item.questionData}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="guides">
              <div className="grid gap-6 md:grid-cols-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-black text-center">
                      Panduan Penggunaan Sistem Penjadwalan
                    </CardTitle>{" "}
                    {/* Changed text color and centered */}
                    <CardDescription className="text-black text-center">
                      {" "}
                      {/* Changed text color and centered */}
                      Langkah-langkah detail untuk menggunakan fitur utama
                      sistem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-black">
                          {" "}
                          {/* Changed text color */}
                          <Calendar className="h-5 w-5 text-[#4F959D]" />
                          Membuat Jadwal Perkuliahan
                        </h3>
                        <ol className="list-decimal pl-5 space-y-2 text-black">
                          {" "}
                          {/* Changed text color */}
                          <li>Login ke sistem dengan akun administrator</li>
                          <li>Navigasi ke menu "Generate Jadwal" di sidebar</li>
                          <li>
                            Pilih semester dan tahun ajaran yang akan
                            dijadwalkan
                          </li>
                          <li>
                            Klik tombol "Generate Jadwal" untuk memulai proses
                          </li>
                          <li>
                            Sistem akan menampilkan preview jadwal yang
                            dihasilkan
                          </li>
                          <li>
                            Periksa jadwal dan lakukan penyesuaian jika
                            diperlukan
                          </li>
                          <li>
                            Klik "Simpan Jadwal" untuk menyimpan jadwal final
                          </li>
                          <li>
                            Jadwal dapat diekspor ke format Excel atau PDF untuk
                            distribusi
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-black">
                          {" "}
                          {/* Changed text color */}
                          <Users className="h-5 w-5 text-[#4F959D]" />
                          Mengelola Data Dosen
                        </h3>
                        <ol className="list-decimal pl-5 space-y-2 text-black">
                          {" "}
                          {/* Changed text color */}
                          <li>Navigasi ke menu "Kelola Dosen" di sidebar</li>
                          <li>
                            Untuk menambah dosen baru, klik tombol "Tambah
                            Dosen"
                          </li>
                          <li>Isi formulir dengan data dosen yang lengkap</li>
                          <li>Atur preferensi waktu mengajar dosen</li>
                          <li>Klik "Simpan" untuk menyimpan data dosen</li>
                          <li>
                            Untuk mengedit data dosen, klik ikon edit pada
                            daftar dosen
                          </li>
                          <li>
                            Untuk menghapus dosen, klik ikon hapus (pastikan
                            dosen tidak terkait dengan jadwal aktif)
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-black">
                          {" "}
                          {/* Changed text color */}
                          <BookOpen className="h-5 w-5 text-[#4F959D]" />
                          Mengelola Mata Kuliah
                        </h3>
                        <ol className="list-decimal pl-5 space-y-2 text-black">
                          {" "}
                          {/* Changed text color */}
                          <li>
                            Navigasi ke menu "Kelola Mata Kuliah" di sidebar
                          </li>
                          <li>
                            Untuk menambah mata kuliah baru, klik tombol "Tambah
                            Mata Kuliah"
                          </li>
                          <li>
                            Isi formulir dengan data mata kuliah yang lengkap
                          </li>
                          <li>Tentukan dosen pengampu mata kuliah</li>
                          <li>Atur prasyarat mata kuliah jika ada</li>
                          <li>
                            Klik "Simpan" untuk menyimpan data mata kuliah
                          </li>
                          <li>
                            Untuk mengedit data mata kuliah, klik ikon edit pada
                            daftar mata kuliah
                          </li>
                          <li>
                            Untuk menghapus mata kuliah, klik ikon hapus
                            (pastikan mata kuliah tidak terkait dengan jadwal
                            aktif)
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-black">
                          {" "}
                          {/* Changed text color */}
                          <Building className="h-5 w-5 text-[#4F959D]" />
                          Mengelola Ruangan
                        </h3>
                        <ol className="list-decimal pl-5 space-y-2 text-black">
                          {" "}
                          {/* Changed text color */}
                          <li>Navigasi ke menu "Kelola Ruangan" di sidebar</li>
                          <li>
                            Untuk menambah ruangan baru, klik tombol "Tambah
                            Ruangan"
                          </li>
                          <li>Isi formulir dengan data ruangan yang lengkap</li>
                          <li>Tentukan kapasitas dan fasilitas ruangan</li>
                          <li>
                            Atur ketersediaan ruangan jika ada batasan waktu
                          </li>
                          <li>Klik "Simpan" untuk menyimpan data ruangan</li>
                          <li>
                            Untuk mengedit data ruangan, klik ikon edit pada
                            daftar ruangan
                          </li>
                          <li>
                            Untuk menghapus ruangan, klik ikon hapus (pastikan
                            ruangan tidak terkait dengan jadwal aktif)
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2 mb-3 text-black">
                          {" "}
                          {/* Changed text color */}
                          <Search className="h-5 w-5 text-[#4F959D]" />
                          Mencari dan Memfilter Data
                        </h3>
                        <ol className="list-decimal pl-5 space-y-2 text-black">
                          {" "}
                          {/* Changed text color */}
                          <li>
                            Pada setiap halaman pengelolaan data, gunakan kotak
                            pencarian di bagian atas tabel
                          </li>
                          <li>Masukkan kata kunci yang ingin dicari</li>
                          <li>
                            Sistem akan menampilkan hasil yang sesuai dengan
                            kata kunci
                          </li>
                          <li>
                            Gunakan filter untuk mempersempit hasil pencarian
                          </li>
                          <li>
                            Klik header kolom untuk mengurutkan data berdasarkan
                            kolom tersebut
                          </li>
                          <li>
                            Gunakan tombol ekspor untuk mengunduh data dalam
                            format Excel atau PDF
                          </li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-black text-center">
                      Video Tutorial
                    </CardTitle>{" "}
                    {/* Changed text color and centered */}
                    <CardDescription className="text-black text-center">
                      {" "}
                      {/* Changed text color and centered */}
                      Panduan visual untuk membantu Anda memahami sistem dengan
                      lebih baik
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                          <BookOpen className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-black">
                            Pengenalan Sistem
                          </h4>{" "}
                          {/* Changed text color */}
                          <p className="text-sm text-black mt-1">
                            {" "}
                            {/* Changed text color */}
                            Penjelasan dasar tentang fitur-fitur utama sistem
                            penjadwalan
                          </p>
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                          <Calendar className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-black">
                            Cara Generate Jadwal
                          </h4>{" "}
                          {/* Changed text color */}
                          <p className="text-sm text-black mt-1">
                            {" "}
                            {/* Changed text color */}
                            Langkah-langkah detail untuk membuat jadwal
                            perkuliahan otomatis
                          </p>
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        <div className="aspect-video bg-gray-200 flex items-center justify-center">
                          <Users className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-black">
                            Mengelola Data Dosen
                          </h4>{" "}
                          {/* Changed text color */}
                          <p className="text-sm text-black mt-1">
                            {" "}
                            {/* Changed text color */}
                            Cara menambah, mengedit, dan menghapus data dosen
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-black text-center">
                      Kontak Dukungan
                    </CardTitle>{" "}
                    {/* Changed text color and centered */}
                    <CardDescription className="text-black text-center">
                      {" "}
                      {/* Changed text color and centered */}
                      Butuh bantuan lebih lanjut? Hubungi tim dukungan kami
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-[#4F959D] flex items-center justify-center text-white">
                          <HelpCircle size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-black">
                            Dukungan Teknis
                          </h4>{" "}
                          {/* Changed text color */}
                          <p className="text-sm text-black">
                            support@sistempenjadwalan.ac.id
                          </p>{" "}
                          {/* Changed text color */}
                          <p className="text-sm text-black">
                            +62 123 4567 890
                          </p>{" "}
                          {/* Changed text color */}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-[#4F959D] flex items-center justify-center text-white">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium text-black">
                            Dokumentasi Lengkap
                          </h4>{" "}
                          {/* Changed text color */}
                          <p className="text-sm text-black">
                            {" "}
                            {/* Changed text color */}
                            Akses dokumentasi lengkap sistem di{" "}
                            <a
                              href="#"
                              className="text-blue-600 hover:underline"
                            >
                              docs.sistempenjadwalan.ac.id
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
