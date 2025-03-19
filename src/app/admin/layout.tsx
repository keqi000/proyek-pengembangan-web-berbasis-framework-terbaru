import NavigationBar from "./_component/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <NavigationBar />

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
