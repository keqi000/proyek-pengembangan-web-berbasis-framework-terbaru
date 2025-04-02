import { z } from "zod";

type MataKuliahItem = {
  id: string;
  kode: string;
  nama: string;
  semester: string;
  sks: string;
};

const courseItemSchema = z.object({
  id: z.number({message: "Id Bukan Angka!"}),
  name: z.string().min(1, {message: "Nama tidak boleh kosong"}),
  semester: z.number().min(1).max(8, {message: "Semester MK paling tinggi adalah 8"}),
  description: z.string().nullable(),
  credit: z.number().min(1)
})

type CourseItem = z.infer<typeof courseItemSchema>

export async function getAllCourse(){
  const response = await fetch(`${process.env.NEXT_PUBLIC_APi_BASE_URL}/course`, {
    method: "GET"
  })

  if (!response.ok){
    throw Error(`fetch error: ${response.status}`)
  }

  // TODO: set typing
  const data: CourseItem[] = await response.json()
  for (let _innerData of data){
    try {
        courseItemSchema.parse(_innerData)
    }
    // TODO: fix type
    catch (err) {
      throw err
    }
  }

  // FIXME: don't transform, instead just use CourseItem type
  const newData: MataKuliahItem[] = data.map((item) => ({
    id: item.id.toString(), 
    kode: item.id.toString(), 
    nama: item.name, 
    semester: item.semester.toString(),
    sks: item.credit.toString(),
  }))
  return newData
}