'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Props {
  params: { id: string };
}

export default function ProdukDetailPage({ params }: Props) {
  const [id, setId] = useState<string | null>(null);
  const produkValid = ['1', '2', '3'];

  useEffect(() => {
    // Meng-unwrap Promise params dengan React.use()
    const fetchId = async () => {
      const { id } = await params;
      setId(id);
    };
    
    fetchId();
  }, [params]);

  const isValid = id && produkValid.includes(id);

  useEffect(() => {
    if (id && !isValid) {
      console.warn('Produk tidak ditemukan:', id);
    }
  }, [id, isValid]);

  if (!id) {
    return <div>Loading...</div>; // Bisa juga memberikan loading state sementara
  }

  if (!isValid) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-700 text-white text-center px-4">
        <div className="max-w-xl py-20">
          <h1 className="text-5xl font-bold mb-6">Oops!</h1>
          <p className="text-lg mb-8">
            404 Page not found<br />
            Maaf, kami tidak dapat menemukan produk dengan ID <strong>{id}</strong>...
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/admin"
              className="bg-blue-800 hover:bg-blue-900 px-5 py-3 rounded text-white transition duration-300"
            >
              Kembali ke Admin
            </Link>
            <Link
              href="/report"
              className="bg-blue-800 hover:bg-blue-900 px-5 py-3 rounded text-white transition duration-300"
            >
              Laporkan Masalah
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Detail Produk</h1>
      <p className="text-lg">
        Menampilkan detail produk dengan ID: <strong>{id}</strong>
      </p>
    </div>
  );
}
