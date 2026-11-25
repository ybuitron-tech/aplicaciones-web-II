import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Las migraciones usan la conexión directa (5432); el runtime usa el pooler (6543).
    url: process.env.DIRECT_URL || process.env.PROYECTO5_DATABASE_URL,
  },
});