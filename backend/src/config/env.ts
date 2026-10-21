import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().min(1)
});

export const env = schema.parse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL
});
