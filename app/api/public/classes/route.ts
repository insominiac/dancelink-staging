import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '../../../lib/db'
import { resolveLocale } from '@/app/lib/locale'
import { translationService } from '@/lib/translation-service'

export async function GET(request: NextRequest) {
  try {
    await ensureDbConnection()
    const locale = resolveLocale(request, 'en')
    // Fetch only active classes that haven't ended
    const classes = await prisma.class.findMany({
      where: {
        isActive: true, // Use isActive instead of status
        OR: [
          { endDate: null }, // Classes without end date are ongoing
          { endDate: { gte: new Date() } } // Classes that haven't ended
        ]
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            addressLine1: true, // Use addressLine1 instead of address
            addressLine2: true
          }
        },
        classInstructors: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    fullName: true, // Use fullName instead of name
                    email: true
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
      orderBy: [
        { startDate: 'asc' }, // Classes with start dates first
        { createdAt: 'asc' }  // Then by creation date
      ]
    })

    // Calculate current students for each class and map field names
    let classesWithStudentCount = await Promise.all(classes.map(async (cls) => {
      // Be resilient if prisma.seatLock is missing in the generated client
      let activeLocks = 0
      try {
        const seatLockModel = (prisma as any).seatLock
        if (seatLockModel?.count) {
          activeLocks = await seatLockModel.count({
            where: { itemType: 'CLASS' as any, itemId: cls.id, status: 'ACTIVE' as any, expiresAt: { gt: new Date() } }
          })
        }
      } catch (_) {
        activeLocks = 0
      }
      const bookingsCount = (cls as any)?._count?.bookings ?? 0
      return ({
        ...cls,
        currentStudents: bookingsCount + activeLocks,
        maxStudents: cls.maxCapacity, // Map maxCapacity to maxStudents for frontend compatibility
        duration: cls.durationMins, // Map durationMins to duration for frontend compatibility
        schedule: cls.scheduleTime || cls.scheduleDays || 'TBD' // Map schedule fields
      })
    }))

    // Server-side translation for dynamic fields
    if (locale && locale !== 'en') {
      const texts: string[] = []
      const positions: { idx: number, key: 'title'|'description'|'requirements'|'venue.name'|'venue.city'|'schedule' }[] = []
      classesWithStudentCount.forEach((c, idx) => {
        if (c.title) { texts.push(c.title); positions.push({ idx, key: 'title' }) }
        if (c.description) { texts.push(c.description); positions.push({ idx, key: 'description' }) }
        if (c.requirements) { texts.push(c.requirements); positions.push({ idx, key: 'requirements' }) }
        if (c.schedule && typeof c.schedule === 'string') { texts.push(c.schedule); positions.push({ idx, key: 'schedule' }) }
        if (c.venue?.name) { texts.push(c.venue.name); positions.push({ idx, key: 'venue.name' }) }
        if (c.venue?.city) { texts.push(c.venue.city); positions.push({ idx, key: 'venue.city' }) }
      })
      if (texts.length) {
        const translated = await translationService.translateBatch(texts, locale, 'en')
        let p = 0
        classesWithStudentCount = classesWithStudentCount.map((c, idx) => {
          const clone: any = { ...c, venue: c.venue ? { ...c.venue } : c.venue }
          positions.forEach(pos => {
            if (pos.idx === idx) {
              const val = translated[p++]
              if (pos.key === 'title') clone.title = val
              else if (pos.key === 'description') clone.description = val
              else if (pos.key === 'requirements') clone.requirements = val
              else if (pos.key === 'schedule') clone.schedule = val
              else if (pos.key === 'venue.name' && clone.venue) clone.venue.name = val
              else if (pos.key === 'venue.city' && clone.venue) clone.venue.city = val
            }
          })
          return clone
        })
      }
    }

    return NextResponse.json({ 
      classes: classesWithStudentCount,
      total: classesWithStudentCount.length 
    })
  } catch (error) {
    console.error('Error fetching public classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}
