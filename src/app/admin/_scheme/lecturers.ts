import { z } from "zod";

export const lecturerScheme = z.object({
  // TODO: set id not optional
  id: z.string().optional(),
  nama: z.string(),
  // TODO: set nip to be nullable
  nip: z.string()
})

export type LecturerTempInputData = z.infer<typeof lecturerScheme>