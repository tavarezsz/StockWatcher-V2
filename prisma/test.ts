import 'dotenv/config'

import { PrismaClient } from "@/db/prisma/generated"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const db = new PrismaClient({ adapter })

async function main() {
  const result = await db.$queryRaw`SELECT 1 as ok`
  console.log('Conexão funcionando:', result)
}

main()
  .catch((err) => {
    console.error('Erro na conexão:', err)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })