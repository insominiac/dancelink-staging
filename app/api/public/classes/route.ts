import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '../../../lib/db'

export async function GET(request: NextRequest) {
  try {
    await ensureDbConnection()
    
    // Fetch all active classes
    const classes = await prisma.class.findMany({
      where: {
        isActive: true
      },
      include: {
        venue: {
          select: {
            name: true,
            city: true
          }
        },
        classInstructors: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    fullName: true
                  }
                }
              }
            }
          }
        },
        classStyles: {
          include: {
            style: true
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the response
    const formattedClasses = classes.map(classData => ({
      id: classData.id,
      title: classData.title,
      description: classData.description,
      level: classData.level,
      duration: classData.durationMins,
      price: classData.price,
      maxStudents: classData.maxCapacity,
      currentStudents: classData._count.bookings,
      schedule: `${classData.scheduleDays} at ${classData.scheduleTime}`,
      startDate: classData.startDate,
      endDate: classData.endDate,
      status: classData.status,
      venue: classData.venue,
      classInstructors: classData.classInstructors,
      classStyles: classData.classStyles,
      imageUrl: classData.imageUrl
    }))

    return NextResponse.json({ classes: formattedClasses })

  } catch (error) {
    console.error('[Classes API Error]', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}

export const revalidate = 0
