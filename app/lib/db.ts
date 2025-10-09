import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const dbUrl = (process.env.USE_LOCAL_DB === 'true' && process.env.LOCAL_DATABASE_URL)
  ? process.env.LOCAL_DATABASE_URL
  : process.env.DATABASE_URL

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: dbUrl,
    },
  },
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
