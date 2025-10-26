import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

const useLocal = process.env.USE_LOCAL_DB === 'true' && !!process.env.LOCAL_DATABASE_URL
const dbUrl = useLocal ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL

export function getPrisma(): PrismaClient {
  if (!prisma) {
    console.log(`[api] db config: useLocal=${useLocal}, hasDatabaseUrl=${!!process.env.DATABASE_URL}`)
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: { db: { url: dbUrl } },
    })
  }
  return prisma
}

export async function ensureDbConnection(retries = 3, delayMs = 500): Promise<PrismaClient> {
  const client = getPrisma()
  let attempt = 0
  while (attempt <= retries) {
    try {
      await client.$connect()
      return client
    } catch (err) {
      attempt += 1
      if (attempt > retries) throw err
      const backoff = Math.min(delayMs * Math.pow(1.5, attempt - 1), 4000)
      await new Promise(res => setTimeout(res, backoff))
    }
  }
  return client
}
