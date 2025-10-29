import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/app/lib/session-middleware'
import prisma from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get cookies from request
    const sessionId = request.cookies.get('session_id')?.value
    const userId = request.cookies.get('user_id')?.value
    const userRole = request.cookies.get('user_role')?.value
    
    // Try to validate session
    const sessionValidation = await validateSession(request)
    
    // Check if there are any admin users in the database
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
    const totalUsers = await prisma.user.count()
    
    // Check session table
    const sessionCount = await prisma.session.count()
    const activeSessions = await prisma.session.count({ 
      where: { 
        isActive: true,
        expiresAt: { gt: new Date() }
      } 
    })
    
    return NextResponse.json({
      status: 'debug',
      timestamp: new Date().toISOString(),
      cookies: {
        hasSessionId: !!sessionId,
        hasUserId: !!userId,
        hasUserRole: !!userRole,
        userRole: userRole
      },
      session: {
        isValid: sessionValidation.isValid,
        error: sessionValidation.error,
        sessionId: sessionValidation.sessionId,
        userId: sessionValidation.userId,
        userRole: sessionValidation.userRole
      },
      database: {
        adminUsers: adminCount,
        totalUsers: totalUsers,
        totalSessions: sessionCount,
        activeSessions: activeSessions
      }
    })
  } catch (error) {
    console.error('Admin auth debug failed:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      }
    }, { status: 500 })
  }
}