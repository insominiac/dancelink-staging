import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

// GET all forum posts
export async function GET(request: Request) {
  try {
    // Check authentication for forum access
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    
    // Allow access in development mode without token
    if (!token && process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to access the forum' },
        { status: 401 }
      )
    }
    
    // Verify token if provided (required in production)
    if (token && process.env.NODE_ENV === 'production') {
      const payload = await verifyToken(token)
      if (!payload) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid session' },
          { status: 401 }
        )
      }
      
      // Get user and check role permissions
      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      })
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
      
      // Check if user has appropriate role
      const allowedRoles = ['USER', 'INSTRUCTOR', 'ADMIN']
      if (!allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions to access forum' },
          { status: 403 }
        )
      }
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = category ? { category } : {}

    const [posts, total] = await Promise.all([
      prisma.forumPost.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.forumPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forum posts' },
      { status: 500 }
    )
  }
}

// POST create new forum post
export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    
    // DEVELOPMENT MODE: Use existing user if no token
    let userId: string
    if (!token && process.env.NODE_ENV === 'development') {
      console.log('🔓 Development mode: Using existing user for forum post')
      // Use the first user from the database for development
      const devUser = await prisma.user.findFirst()
      if (!devUser) {
        return NextResponse.json(
          { error: 'No users found in development mode' },
          { status: 500 }
        )
      }
      userId = devUser.id
    } else {
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      const payload = await verifyToken(token)
      if (!payload) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      userId = payload.userId
    }

    const body = await request.json()
    const { title, content, category } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        category,
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImage: true,
          },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating forum post:', error)
    return NextResponse.json(
      { error: 'Failed to create forum post' },
      { status: 500 }
    )
  }
}