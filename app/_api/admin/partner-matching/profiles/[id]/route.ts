import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { isActiveForMatching, adminNotes } = await req.json();
    const profileId = params.id;

    // Update the user profile
    const updatedProfile = await prisma.userProfile.update({
      where: { id: profileId },
      data: {
        isActiveForMatching,
        adminNotes,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImage: true,
            role: true,
            createdAt: true
          }
        },
        danceStyles: {
          include: {
            style: true
          }
        },
        _count: {
          select: {
            sentRequests: true,
            receivedRequests: true
          }
        }
      }
    });

    // If profile is deactivated, also deactivate any active matches
    if (!isActiveForMatching) {
      await prisma.match.updateMany({
        where: {
          OR: [
            { user1Id: updatedProfile.userId },
            { user2Id: updatedProfile.userId }
          ],
          isActive: true
        },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const profileId = params.id;

    // Get the profile to find user ID
    const profile = await prisma.userProfile.findUnique({
      where: { id: profileId }
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profile not found' },
        { status: 404 }
      );
    }

    // Delete related records first
    await prisma.$transaction(async (tx) => {
      // Delete match requests
      await tx.matchRequest.deleteMany({
        where: {
          OR: [
            { senderId: profileId },
            { receiverId: profileId }
          ]
        }
      });

      // Deactivate matches
      await tx.match.updateMany({
        where: {
          OR: [
            { user1Id: profile.userId },
            { user2Id: profile.userId }
          ]
        },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      });

      // Delete dance styles
      await tx.userProfileDanceStyle.deleteMany({
        where: { userProfileId: profileId }
      });

      // Finally delete the profile
      await tx.userProfile.delete({
        where: { id: profileId }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}