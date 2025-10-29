import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;

    // Build where clause
    let where: any = {};

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    if (search) {
      where.OR = [
        {
          user1: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        },
        {
          user2: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } }
            ]
          }
        }
      ];
    }

    const [matchesData, totalCount] = await Promise.all([
      prisma.match.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.match.count({ where })
    ]);

    // Fetch user data for matches
    const userIds = [...new Set([
      ...matchesData.map(match => match.user1Id),
      ...matchesData.map(match => match.user2Id)
    ])];

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        profileImage: true,
        role: true
      }
    });

    const userMap = new Map(users.map(user => [user.id, user]));

    const matches = matchesData.map(match => ({
      ...match,
      user1: userMap.get(match.user1Id),
      user2: userMap.get(match.user2Id)
    }));

    return NextResponse.json({
      success: true,
      data: {
        matches,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching matches for admin:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}