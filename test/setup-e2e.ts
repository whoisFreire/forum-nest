import 'dotenv/config'

import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { generateUniqueDatabaseURL } from './utils/generate-unique-database-url'

const schemaId = randomUUID()
const databaseURL = generateUniqueDatabaseURL(schemaId)

let prisma: PrismaClient

beforeAll(async () => {
  process.env.DATABASE_URL = databaseURL
  process.env.DATABASE_SCHEMA = schemaId

  const adapter = new PrismaPg({ connectionString: databaseURL })
  prisma = new PrismaClient({ adapter })

  execSync('npx prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
