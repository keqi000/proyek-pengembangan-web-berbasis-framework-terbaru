type SummaryItem = {
  label: string;
  value: number;
}

// Data ringkasan (contoh)
const summaryData: SummaryItem[] = [
  { label: "Jumlah Dosen", value: 35 },
  { label: "Jumlah Ruangan", value: 20 },
  { label: "Jadwal yang Digenerate", value: 150 },
];

export default function Home() {
  return (
    <div className=" bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-black">
        Beranda
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md text-center"
          >
            <h2 className="text-lg font-semibold text-black">{item.label}</h2>{" "}
            <p className="text-3xl font-bold text-black">{item.value}</p>{" "}
          </div>
        ))}
      </div>
    </div>
  );
}
