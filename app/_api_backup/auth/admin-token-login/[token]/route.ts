import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { createSession } from '@/app/lib/session-middleware'
import { UserRole } from '@prisma/client'

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
    }

    // Find the login token with creator
    const loginToken = await prisma.loginToken.findUnique({
      where: { token },
      include: {
        createdByUser: true
      }
    })

    if (!loginToken) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 404 })
    }

    // Validate token status
    if (!loginToken.isActive) {
      return NextResponse.json({ success: false, error: 'Token is inactive' }, { status: 403 })
    }
    if (loginToken.expiresAt && loginToken.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Token has expired' }, { status: 403 })
    }
    if (loginToken.maxUses && loginToken.usedCount >= loginToken.maxUses) {
      return NextResponse.json({ success: false, error: 'Token usage limit reached' }, { status: 403 })
    }

    // Ensure ADMIN role is allowed by this token
    const allowedRoles = loginToken.allowedRoles as UserRole[] | null
    if (!allowedRoles || !allowedRoles.includes('ADMIN' as UserRole)) {
      return NextResponse.json({ success: false, error: 'Admin access not allowed for this token' }, { status: 403 })
    }

    // Determine target admin user
    // Priority: metadata.email -> token creator (if ADMIN) -> any existing ADMIN -> create dev admin
    let targetUser = null as null | { id: string; role: UserRole }

    // Try metadata email
    const metadata = loginToken.metadata ? JSON.parse(loginToken.metadata) : null
    const metaEmail: string | undefined = metadata?.email
    if (metaEmail) {
      targetUser = await prisma.user.findFirst({ where: { email: metaEmail, role: 'ADMIN' } })
    }

    // Fallback to creator
    if (!targetUser && loginToken.createdByUser && loginToken.createdByUser.role === 'ADMIN') {
      targetUser = { id: loginToken.createdByUser.id, role: 'ADMIN' as UserRole }
    }

    // Fallback to any admin
    if (!targetUser) {
      targetUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    }

    // If no admin exists, create a development admin user
    if (!targetUser) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@dev.local',
          passwordHash: hashedPassword,
          fullName: 'Development Admin',
          role: 'ADMIN',
          isVerified: true
        }
      })
      targetUser = { id: newAdmin.id, role: 'ADMIN' as UserRole }
    }

    // Create session for the admin user
    const sessionResult = await createSession(request, targetUser.id, 'ADMIN' as UserRole)
    if (sessionResult.error) {
      return NextResponse.json({ success: false, error: sessionResult.error }, { status: 500 })
    }

    // Update token usage
    await prisma.loginToken.update({
      where: { id: loginToken.id },
      data: {
        usedCount: { increment: 1 },
        lastUsedAt: new Date()
      }
    })

    // Set HTTP-only cookies for session management
    const response = NextResponse.json({ success: true, message: 'Admin token login successful' })
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    }

    response.cookies.set('session_id', sessionResult.sessionId, cookieOptions)
    response.cookies.set('user_id', targetUser.id, cookieOptions)
    response.cookies.set('user_role', 'ADMIN', cookieOptions)

    return response
  } catch (error) {
    console.error('Admin token login error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
