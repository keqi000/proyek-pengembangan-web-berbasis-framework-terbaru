import { z } from "zod"

export const courseItemSchema = z.object({
  id: z.number({message: "Id Bukan Angka!"}),
  name: z.string().min(1, {message: "Nama tidak boleh kosong"}),
  semester: z.number().min(1).max(8, {message: "Semester MK paling tinggi adalah 8"}),
  description: z.string().nullable(),
  credit: z.number().min(1)
})

export type CourseItem = z.infer<typeof courseItemSchema>