import { z } from "zod";

export const roomScheme = z.object({
  id: z.string(),
  nama: z.string(),
  kapasitas: z.string()
})

export type RuanganItem = z.infer<typeof roomScheme>