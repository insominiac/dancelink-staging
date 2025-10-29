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

    const { isActive, adminNotes } = await req.json();
    const matchId = params.id;

    // Update the match
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        isActive,
        adminNotes,
        updatedAt: new Date()
      },
      include: {
        user1: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImage: true,
            role: true
          }
        },
        user2: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImage: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedMatch
    });
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update match' },
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

    const matchId = params.id;

    // Delete the match
    await prisma.match.delete({
      where: { id: matchId }
    });

    return NextResponse.json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete match' },
      { status: 500 }
    );
  }
}