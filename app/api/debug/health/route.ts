import { NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

export async function GET() {
  try {
    // Test database connection
    const dbTest = await prisma.$queryRaw`SELECT 1 as test`
    
    // Test basic table existence
    const userCount = await prisma.user.count().catch(() => -1)
    const sessionCount = await prisma.session.count().catch(() => -1)
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connection: 'connected',
        test: dbTest,
        tables: {
          users: userCount,
          sessions: sessionCount
        }
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabase: !!process.env.DATABASE_URL,
        databaseHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'hidden'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabase: !!process.env.DATABASE_URL,
        databaseHost: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'hidden'
      }
    }, { status: 500 })
  }
}