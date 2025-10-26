import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Query parameters for filtering
    const experienceLevel = searchParams.get('experienceLevel');
    const location = searchParams.get('location');
    const danceStyleId = searchParams.get('danceStyleId');
    const lookingFor = searchParams.get('lookingFor');
    const ageRange = searchParams.get('ageRange');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';

    // Build filter conditions
    let whereConditions: any = {
      isActiveForMatching: true
    };

    // Add filters based on query parameters
    if (experienceLevel) {
      whereConditions.experienceLevel = experienceLevel;
    }

    if (location) {
      whereConditions.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    if (lookingFor) {
      whereConditions.lookingFor = {
        has: lookingFor
      };
    }

    if (ageRange) {
      whereConditions.ageRange = {
        contains: ageRange,
        mode: 'insensitive'
      };
    }

    if (search) {
      whereConditions.OR = [
        {
          user: {
            fullName: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          bio: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Find potential matches
    let profiles = await prisma.userProfile.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profileImage: true
          }
        },
        danceStyles: {
          include: {
            style: true
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Filter by dance style if specified
    if (danceStyleId) {
      profiles = profiles.filter(profile =>
        profile.danceStyles.some(ds => ds.styleId === danceStyleId)
      );
    }

    // Get total count for pagination
    const totalCount = await prisma.userProfile.count({
      where: whereConditions
    });

    // Sanitize profiles for public consumption (remove sensitive information)
    const sanitizedProfiles = profiles.map(profile => ({
      id: profile.id,
      bio: profile.bio,
      location: profile.location,
      experienceLevel: profile.experienceLevel,
      lookingFor: profile.lookingFor,
      ageRange: profile.ageRange,
      user: {
        id: profile.user.id,
        fullName: profile.user.fullName,
        profileImage: profile.user.profileImage
      },
      danceStyles: profile.danceStyles.map(ds => ({
        level: ds.level,
        style: {
          id: ds.style.id,
          name: ds.style.name,
          category: ds.style.category
        }
      })),
      createdAt: profile.createdAt
    }));

    return NextResponse.json({
      success: true,
      data: {
        profiles: sanitizedProfiles,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      }
    });
  } catch (error) {
    console.error('Error searching dance partners:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search dance partners' },
      { status: 500 }
    );
  }
}