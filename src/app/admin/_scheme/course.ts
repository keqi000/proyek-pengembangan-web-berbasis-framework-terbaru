import { z } from "zod";

export const courseScheme = z.object({
  // TODO: fix type
  id: z.string().optional(),
  kode: z.string(),
  nama: z.string(),
  semester: z.string(),
  sks: z.string()
})

export type CourseTempInputData = z.infer<typeof courseScheme>