import { PrismaClient } from "@/db/prisma/generated"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const db = new PrismaClient({ adapter })
