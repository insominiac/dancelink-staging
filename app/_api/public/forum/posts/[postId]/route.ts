import { NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

// GET single forum post with replies - Public endpoint (no authentication required)
export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params

    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profileImage: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                profileImage: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    profileImage: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Forum post not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.forumPost.update({
      where: { id: postId },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    })

    // Return post with updated view count
    return NextResponse.json({
      ...post,
      viewsCount: post.viewsCount + 1,
    })
  } catch (error) {
    console.error('Error fetching forum post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forum post' },
      { status: 500 }
    )
  }
}