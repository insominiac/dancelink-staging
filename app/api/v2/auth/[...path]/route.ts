import { NextRequest, NextResponse } from 'next/server'
import { 
  getCurrentUser, 
  requireAuth, 
  authenticateUser, 
  createSession, 
  clearSession,
  hashPassword,
  isValidEmail,
  isValidPassword
} from '@/app/lib/auth'
import prisma from '@/app/lib/db'
import jwt from 'jsonwebtoken'

// Consolidated auth API handler
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const [action, token] = params.path

    switch (action) {
      case 'me':
        return handleGetCurrentUser(request)
      
      case 'sessions':
        return handleGetSessions(request)
      
      case 'login-tokens':
        return handleGetLoginTokens(request)
      
      case 'validate-token':
        if (token) {
          return handleValidateToken(token)
        }
        return NextResponse.json({ error: 'Token required' }, { status: 400 })
      
      case 'debug':
        return handleDebugAuth(request)
      
      default:
        return NextResponse.json(
          { error: 'Action not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    console.error('Auth API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const [action, subAction] = params.path
    const body = await request.json()

    switch (action) {
      case 'login':
        return handleLogin(body)
      
      case 'register':
        return handleRegister(body)
      
      case 'logout':
        return handleLogout(request)
      
      case 'demo-login':
        return handleDemoLogin(body)
      
      case 'instructor-demo-login':
        return handleInstructorDemoLogin(body)
      
      case 'admin-token-login':
        if (subAction) {
          return handleAdminTokenLogin(subAction)
        }
        return NextResponse.json({ error: 'Token required' }, { status: 400 })
      
      case 'switch-role':
        return handleSwitchRole(request, body)
      
      case 'generate-login-token':
        return handleGenerateLoginToken(request, body)
      
      case 'sessions':
        if (subAction === 'cleanup') {
          return handleCleanupSessions(request)
        }
        return handleCreateSession(request, body)
      
      default:
        return NextResponse.json(
          { error: 'Action not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    console.error('Auth API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const [action, id] = params.path

    switch (action) {
      case 'sessions':
        if (id) {
          return handleDeleteSession(request, id)
        } else {
          return handleDeleteAllSessions(request)
        }
      
      case 'login-tokens':
        if (id) {
          return handleDeleteLoginToken(request, id)
        }
        return NextResponse.json({ error: 'Token ID required' }, { status: 400 })
      
      default:
        return NextResponse.json(
          { error: 'Action not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    console.error('Auth API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handler functions
async function handleGetCurrentUser(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }
}

async function handleLogin(data: { email: string; password: string; remember?: boolean }) {
  const { email, password, remember = false } = data

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    )
  }

  try {
    const user = await authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 401 }
      )
    }

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

async function handleRegister(data: {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}) {
  const { fullName, email, password, role = 'USER' } = data

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: 'Full name, email, and password are required' },
      { status: 400 }
    )
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    )
  }

  const passwordValidation = isValidPassword(password)
  if (!passwordValidation.valid) {
    return NextResponse.json(
      { error: passwordValidation.message },
      { status: 400 }
    )
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase(),
        passwordHash,
        role: role as any,
        isVerified: false // In production, require email verification
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    })

    // For demo purposes, auto-verify the user
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true }
    })

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      role: user.role
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}

async function handleLogout(request: NextRequest) {
  try {
    await clearSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}

async function handleDemoLogin(data: { role?: string }) {
  const { role = 'USER' } = data

  try {
    // Find or create demo user
    let demoUser = await prisma.user.findUnique({
      where: { email: `demo-${role.toLowerCase()}@dancelink.com` }
    })

    if (!demoUser) {
      const passwordHash = await hashPassword('demo123')
      demoUser = await prisma.user.create({
        data: {
          fullName: `Demo ${role} User`,
          email: `demo-${role.toLowerCase()}@dancelink.com`,
          passwordHash,
          role: role as any,
          isVerified: true
        }
      })
    }

    // Create session
    await createSession({
      id: demoUser.id,
      email: demoUser.email,
      role: demoUser.role
    })

    return NextResponse.json({
      success: true,
      user: {
        id: demoUser.id,
        email: demoUser.email,
        fullName: demoUser.fullName,
        role: demoUser.role
      }
    })
  } catch (error) {
    console.error('Demo login error:', error)
    return NextResponse.json(
      { error: 'Demo login failed' },
      { status: 500 }
    )
  }
}

async function handleInstructorDemoLogin(data: any) {
  return handleDemoLogin({ role: 'INSTRUCTOR' })
}

async function handleAdminTokenLogin(token: string) {
  try {
    // In a real implementation, validate the admin token
    // For demo purposes, create/login as admin user
    let adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (!adminUser) {
      const passwordHash = await hashPassword('admin123')
      adminUser = await prisma.user.create({
        data: {
          fullName: 'Admin User',
          email: 'admin@dancelink.com',
          passwordHash,
          role: 'ADMIN',
          isVerified: true
        }
      })
    }

    // Create session
    await createSession({
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    })

    return NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        fullName: adminUser.fullName,
        role: adminUser.role
      }
    })
  } catch (error) {
    console.error('Admin token login error:', error)
    return NextResponse.json(
      { error: 'Admin login failed' },
      { status: 500 }
    )
  }
}

async function handleSwitchRole(request: NextRequest, data: { role: string }) {
  try {
    const currentUser = await requireAuth(request)
    const { role } = data

    // Only allow role switching for demo purposes or admin users
    if (currentUser.role !== 'ADMIN' && !currentUser.email.includes('demo')) {
      return NextResponse.json(
        { error: 'Not authorized to switch roles' },
        { status: 403 }
      )
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { role: role as any },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true
      }
    })

    // Update session
    await createSession({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role
    })

    return NextResponse.json({
      success: true,
      user: updatedUser
    })
  } catch (error) {
    console.error('Role switch error:', error)
    return NextResponse.json(
      { error: 'Failed to switch role' },
      { status: 500 }
    )
  }
}

async function handleGenerateLoginToken(request: NextRequest, data: { userId?: string; expiresIn?: string }) {
  try {
    const currentUser = await requireAuth(request)
    
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can generate login tokens' },
        { status: 403 }
      )
    }

    const { userId, expiresIn = '24h' } = data
    const targetUserId = userId || currentUser.id

    // Generate JWT token
    const token = jwt.sign(
      { userId: targetUserId, type: 'login' },
      process.env.JWT_SECRET || 'development-secret',
      { expiresIn }
    )

    return NextResponse.json({
      success: true,
      token,
      loginUrl: `/auth/admin-token-login/${token}`
    })
  } catch (error) {
    console.error('Generate login token error:', error)
    return NextResponse.json(
      { error: 'Failed to generate login token' },
      { status: 500 }
    )
  }
}

async function handleValidateToken(token: string) {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'development-secret'
    ) as any

    if (payload.type !== 'login') {
      return NextResponse.json(
        { error: 'Invalid token type' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isVerified: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      user
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}

async function handleDebugAuth(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    return NextResponse.json({
      isAuthenticated: !!user,
      user: user || null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}

// Session management handlers
async function handleGetSessions(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // In a real implementation, you'd fetch active sessions from a sessions table
    // For now, just return current session info
    return NextResponse.json({
      sessions: [{
        id: 'current',
        userId: user.id,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        current: true
      }]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
}

async function handleCreateSession(request: NextRequest, data: any) {
  // This would typically be handled by login
  return NextResponse.json(
    { error: 'Use login endpoint to create sessions' },
    { status: 400 }
  )
}

async function handleDeleteSession(request: NextRequest, sessionId: string) {
  try {
    const user = await requireAuth(request)
    
    if (sessionId === 'current') {
      await clearSession()
      return NextResponse.json({ success: true })
    }
    
    // In a real implementation, delete the specific session
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
}

async function handleDeleteAllSessions(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    // Clear current session
    await clearSession()
    
    // In a real implementation, delete all user sessions from database
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
}

async function handleCleanupSessions(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      )
    }
    
    // In a real implementation, clean up expired sessions
    
    return NextResponse.json({
      success: true,
      cleaned: 0
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
}

// Login token handlers
async function handleGetLoginTokens(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      )
    }
    
    // In a real implementation, fetch login tokens from database
    return NextResponse.json({
      tokens: []
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
}

async function handleDeleteLoginToken(request: NextRequest, tokenId: string) {
  try {
    const user = await requireAuth(request)
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      )
    }
    
    // In a real implementation, delete the login token
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
}