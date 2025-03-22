"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "JADWAL KULIAH ANDA",
    description:
      "09:00 - 10:30 | Pemrograman Web | Ruang 202 | Dosen: Budi Santoso",
  },
  {
    title: "MOTIVASI DAN SPIRIT",
    description: "Jangan menunda tugas, buat jadwal belajar yang teratur!",
  },
  {
    title: "FITUR APLIKASI",
    description:
      "Klik tombol Cetak Jadwal untuk mengunduh jadwal kuliah dalam format PDF!",
  },
];

const HeroSlider = () => {
  return (
    <section className="relative w-full h-[78vh]">
      {/* Background Image (Tetap Statis) */}
      <div className="absolute inset-0">
        <Image
          src="/bg-hero.jpg"
          layout="fill"
          objectFit="cover"
          alt="Background"
        />
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>

      {/* Swiper untuk Tulisan */}
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        speed={800}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div>
              {/* Posisi teks tengah kiri */}
              <div className="absolute left-10 top-1/2 -translate-y-1/2 max-w-lg text-white">
                <h1 className="text-5xl font-bebas leading-tight">
                  {slide.title}
                </h1>
                <p className="mt-4 text-lg opacity-90 font-poppins">
                  {slide.description}
                </p>
                <button className="mt-6 px-6 py-3 bg-[#2C3930] hover:bg-[#3F4F44] text-white font-poppins rounded-lg">
                  Cetak Jadwal
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styling untuk Pagination */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 50px !important; /* Posisi pagination lebih ke atas */
        }
        .swiper-pagination-bullet {
          background-color: white !important;
          width: 10px;
          height: 10px;
          opacity: 1;
          transition: all 0.3s ease-in-out;
        }
        .swiper-pagination-bullet-active {
          background-color: #3f4f44 !important;
          width: 20px;
          height: 20px;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;
