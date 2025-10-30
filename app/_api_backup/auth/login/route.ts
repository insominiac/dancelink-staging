import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, isValidEmail } from '@/app/lib/auth'
import { createSession, checkRoleConflict } from '@/app/lib/session-middleware'
import { generateDeviceFingerprint } from '@/app/lib/device-fingerprint'
import { AuditLogger } from '@/app/lib/audit-logger'
import prisma from '@/app/lib/db'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          error: 'Email and password are required',
          success: false
        },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: 'Invalid email format',
          success: false
        },
        { status: 400 }
      )
    }

    // Special development demo logins
    const demoAccounts = {
      'admin@dev.local': { password: 'admin123', role: 'ADMIN' as UserRole, fullName: 'Development Admin' },
      'instructor@demo.com': { password: 'instructor123', role: 'INSTRUCTOR' as UserRole, fullName: 'Demo Instructor' },
      'user@demo.com': { password: 'user123', role: 'USER' as UserRole, fullName: 'Demo User' },
      'host@demo.com': { password: 'host123', role: 'HOST' as UserRole, fullName: 'Demo Host' }
    }

    const demoAccount = demoAccounts[email as keyof typeof demoAccounts]
    
    if (demoAccount && password === demoAccount.password) {
      console.log(`🔓 Development ${demoAccount.role.toLowerCase()} login`)
      
      // Check if demo user exists, create if not
      let user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        console.log(`Creating development ${demoAccount.role.toLowerCase()} user...`)
        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash(demoAccount.password, 10)
        
        const userData: any = {
          email,
          passwordHash: hashedPassword,
          fullName: demoAccount.fullName,
          role: demoAccount.role,
          isVerified: true
        }
        
        // If it's an instructor or host, create related records too
        if (demoAccount.role === 'INSTRUCTOR') {
          user = await prisma.user.create({
            data: {
              ...userData,
              instructor: {
                create: {
                  specialty: 'Contemporary & Ballet',
                  experienceYears: 5,
                  rating: 4.8,
                  isActive: true
                }
              }
            },
            include: {
              instructor: true
            }
          })
        } else if (demoAccount.role === 'HOST') {
          user = await prisma.user.create({
            data: userData
          })
          // Create a richer demo host profile and auto-approve it
          await prisma.host.create({
            data: {
              userId: user.id,
              businessName: 'Demo Dance Academy',
              businessType: 'Studio',
              description: 'A premier dance studio offering classes in salsa, hip hop, ballet, and contemporary for all levels.',
              experienceYears: 5,
              country: 'USA',
              city: 'New York',
              isVerified: true,
              isApproved: true,
              applicationStatus: 'APPROVED',
              approvedAt: new Date()
            }
          })
        } else {
          user = await prisma.user.create({
            data: userData
          })
        }
      } else if (demoAccount.role === 'HOST') {
        // Ensure a host profile exists for existing demo host user
        const existingHost = await prisma.host.findUnique({ where: { userId: user.id } })
        if (!existingHost) {
          await prisma.host.create({
            data: {
              userId: user.id,
              businessName: 'Demo Dance Academy',
              businessType: 'Studio',
              description: 'A premier dance studio offering classes in salsa, hip hop, ballet, and contemporary for all levels.',
              experienceYears: 5,
              country: 'USA',
              city: 'New York',
              isVerified: true,
              isApproved: true,
              applicationStatus: 'APPROVED',
              approvedAt: new Date()
            }
          })
        } else {
          // Upgrade existing minimal demo host profile to approved with richer details
          await prisma.host.update({
            where: { userId: user.id },
            data: {
              description: existingHost.description ?? 'A premier dance studio offering classes in salsa, hip hop, ballet, and contemporary for all levels.',
              experienceYears: existingHost.experienceYears ?? 5,
              isVerified: true,
              isApproved: true,
              applicationStatus: 'APPROVED',
              approvedAt: existingHost.approvedAt ?? new Date()
            }
          })
        }
      }

      // Check for role conflicts
      const roleConflict = await checkRoleConflict(request, user.role as UserRole)
      
      // Create session
      const sessionResult = await createSession(request, user.id, user.role as UserRole)
      
      if (sessionResult.error) {
        return NextResponse.json({
          success: false,
          error: sessionResult.error
        }, { status: 500 })
      }

      // Set session cookies
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isVerified: user.isVerified,
          profileImage: user.profileImage
        },
        sessionId: sessionResult.sessionId,
        conflictingRole: roleConflict.conflictingRole
      })

      // Set HTTP-only cookies for session management
      response.cookies.set('session_id', sessionResult.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      })
      
      response.cookies.set('user_id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60
      })
      
      response.cookies.set('user_role', user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60
      })

      // Log successful demo login
      await AuditLogger.logLogin(user.id)

      return response
    }

    // Authenticate user
    const user = await authenticateUser(email, password)
    
    if (!user) {
      // Log failed login attempt
      await AuditLogger.logFailedLogin(email, 'Invalid credentials')
      
      return NextResponse.json(
        {
          error: 'Invalid email or password',
          success: false
        },
        { status: 401 }
      )
    }

    // Check if user account is verified (optional requirement)
    if (!user.isVerified) {
      // Log failed login attempt due to unverified account
      await AuditLogger.logFailedLogin(email, 'Account not verified')
      
      return NextResponse.json(
        {
          error: 'Please verify your email address before logging in',
          success: false,
          requiresVerification: true
        },
        { status: 403 }
      )
    }

    // Check for role conflicts
    const roleConflict = await checkRoleConflict(request, user.role as UserRole)
    
    // Create session
    const sessionResult = await createSession(request, user.id, user.role as UserRole)
    
    if (sessionResult.error) {
      return NextResponse.json({
        success: false,
        error: sessionResult.error
      }, { status: 500 })
    }

    // Set session cookies and return response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage
      },
      sessionId: sessionResult.sessionId,
      conflictingRole: roleConflict.conflictingRole
    }, { status: 200 })

    // Set HTTP-only cookies for session management
    response.cookies.set('session_id', sessionResult.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })
    
    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60
    })
    
    response.cookies.set('user_role', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60
    })

    // Log successful login
    await AuditLogger.logLogin(user.id)

    return response

  } catch (error) {
    console.error('Login error:', error)
    
    // Log system error
    await AuditLogger.logSystemEvent('LOGIN_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      {
        error: 'Internal server error. Please try again later.',
        success: false
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
