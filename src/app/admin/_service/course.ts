type MataKuliahItem = {
  id: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
};

type CourseItem = {
  id: number,
  name: string,
  semester: number,
  description: string
}

export async function getAllCourse(){
  const response = await fetch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course`, {
    method: "GET"
  })

  if (!response.ok){
    throw Error(`fetch error: ${response.status}`)
  }

  // TODO: set typing
  const data: CourseItem[] = await response.json()
  const newData: MataKuliahItem[] = data.map((item) => ({
    id: item.id.toString(), 
    kode: item.id.toString(), 
    nama: item.name, 
    semester: item.semester.toString(),
    sks: String(10),
  }))
  return newData
}