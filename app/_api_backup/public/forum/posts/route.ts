import { NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

// GET all forum posts - Public endpoint (no authentication required)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = category && category !== 'all' ? { category } : {}

    const [posts, total] = await Promise.all([
      prisma.forumPost.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
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

    // Increment view counts for posts
    if (posts.length > 0) {
      await prisma.forumPost.updateMany({
        where: {
          id: {
            in: posts.map(post => post.id)
          }
        },
        data: {
          viewsCount: {
            increment: 1
          }
        }
      })
    }

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        viewsCount: post.viewsCount + 1 // Return updated view count
      })),
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