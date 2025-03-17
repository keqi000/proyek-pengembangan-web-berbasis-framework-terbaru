import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-[#4F959D] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Sistem Penjadwalan</h1>
          <ul className="flex space-x-6">
            <li>
              <Link href="/admin/home" className="hover:underline">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/admin/manage_lecturers" className="hover:underline">
                Kelola Dosen
              </Link>
            </li>
            <li>
              <Link href="/admin/manage_room" className="hover:underline">
                Kelola Ruangan
              </Link>
            </li>
            <li>
              <Link href="/admin/generate_schedule" className="hover:underline">
                Generate Jadwal
              </Link>
            </li>
            <li>
              <Link href="../" className="hover:underline">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Konten utama diperbaiki supaya mengisi ruang kosong */}
      <main className="flex-grow p-3 flex items-center justify-center">
        {children}
      </main>

      {/* Footer selalu di bawah tanpa menyebabkan scroll berlebihan */}
      <footer className="bg-gray-200 text-center p-3">
        <p className="text-gray-700">&copy; 2025 Sistem Penjadwalan Otomatis</p>
      </footer>
    </div>
  );
}
