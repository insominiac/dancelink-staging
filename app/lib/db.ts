import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
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

// Best-effort connection helper with retry for cold/waking DBs (e.g., Railway)
export async function ensureDbConnection(retries = 5, delayMs = 750): Promise<PrismaClient> {
  let attempt = 0
  while (attempt <= retries) {
    try {
      await prisma.$connect()
      return prisma
    } catch (err) {
      attempt += 1
      if (attempt > retries) throw err
      const backoff = Math.min(delayMs * Math.pow(1.5, attempt - 1), 5000)
      await new Promise(res => setTimeout(res, backoff))
    }
  }
  return prisma
}

export default prisma
