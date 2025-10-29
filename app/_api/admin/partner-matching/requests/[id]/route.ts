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

    const { status, adminNotes } = await req.json();
    const requestId = params.id;

    // Validate status
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update the match request
    const updatedRequest = await prisma.matchRequest.update({
      where: { id: requestId },
      data: {
        status,
        adminNotes,
        updatedAt: new Date()
      },
      include: {
        sender: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                profileImage: true,
                role: true
              }
            }
          }
        },
        receiver: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                profileImage: true,
                role: true
              }
            }
          }
        }
      }
    });

    // If status is ACCEPTED, create a match
    if (status === 'ACCEPTED') {
      try {
        const existingMatch = await prisma.match.findFirst({
          where: {
            OR: [
              {
                user1Id: updatedRequest.sender.userId,
                user2Id: updatedRequest.receiver.userId
              },
              {
                user1Id: updatedRequest.receiver.userId,
                user2Id: updatedRequest.sender.userId
              }
            ]
          }
        });

        if (!existingMatch) {
          await prisma.match.create({
            data: {
              user1Id: updatedRequest.sender.userId,
              user2Id: updatedRequest.receiver.userId,
              matchScore: 0.85, // Default score for admin-approved matches
              isActive: true,
              matchedAt: new Date()
            }
          });
        }
      } catch (matchError) {
        console.error('Error creating match:', matchError);
        // Continue even if match creation fails - the request status is still updated
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error updating match request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update match request' },
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

    const requestId = params.id;

    // Delete the match request
    await prisma.matchRequest.delete({
      where: { id: requestId }
    });

    return NextResponse.json({
      success: true,
      message: 'Match request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting match request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete match request' },
      { status: 500 }
    );
  }
}