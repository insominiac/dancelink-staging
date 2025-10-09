import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Require authentication and HOST role
    const user = await requireAuth(request)
    
    if (user.role !== 'HOST') {
      return NextResponse.json(
        { error: 'Host privileges required' },
        { status: 403 }
      )
    }

    // Fetch host profile
    const host = await prisma.host.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true
          }
        },
        approvedBy: {
          select: {
            fullName: true
          }
        }
      }
    })

    if (!host) {
      return NextResponse.json(
        { error: 'Host profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      host: {
        id: host.id,
        businessName: host.businessName,
        businessType: host.businessType,
        description: host.description,
        experienceYears: host.experienceYears,
        country: host.country,
        city: host.city,
        isVerified: host.isVerified,
        isApproved: host.isApproved,
        applicationStatus: host.applicationStatus,
        rejectionReason: host.rejectionReason,
        approvedAt: host.approvedAt,
        approvedBy: host.approvedBy?.fullName,
        createdAt: host.createdAt,
        updatedAt: host.updatedAt,
        user: host.user
      }
    })

  } catch (error: any) {
    console.error('Error fetching host profile:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch host profile' },
      { status: 500 }
    )
  }
}