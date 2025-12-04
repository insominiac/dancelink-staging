import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '../../../../lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDbConnection()
    
    const { id } = params

    // Fetch the specific class with all related data
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            addressLine1: true,
            addressLine2: true
          }
        },
        classStyles: {
          include: {
            style: true
          }
        },
        classInstructors: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['CONFIRMED', 'COMPLETED']
                }
              }
            }
          }
        }
      }
    })

    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      )
    }

    // Calculate current students from confirmed bookings
    const currentStudents = classData._count.bookings

    // Check for active seat locks to add to current students
    let activeLocks = 0
    try {
      const seatLockModel = (prisma as any).seatLock
      if (seatLockModel?.count) {
        activeLocks = await seatLockModel.count({
          where: {
            itemType: 'CLASS',
            itemId: id,
            expiresAt: {
              gt: new Date()
            }
          }
        })
      }
    } catch (error) {
      console.log('[Class API] SeatLock model not available, skipping lock check')
    }

    // Return class data with formatted response
    return NextResponse.json({
      class: {
        id: classData.id,
        title: classData.title,
        description: classData.description,
        level: classData.level,
        durationMins: classData.durationMins,
        price: classData.price,
        maxCapacity: classData.maxCapacity,
        currentStudents: currentStudents + activeLocks,
        scheduleDays: classData.scheduleDays,
        scheduleTime: classData.scheduleTime,
        startDate: classData.startDate,
        endDate: classData.endDate,
        status: classData.status,
        isActive: classData.isActive,
        venue: classData.venue,
        classInstructors: classData.classInstructors,
        classStyles: classData.classStyles
      }
    })

  } catch (error) {
    console.error('[Class Detail API Error]', error)
    return NextResponse.json(
      { error: 'Failed to fetch class details' },
      { status: 500 }
    )
  }
}

export const revalidate = 0
