import { FastifyInstance } from 'fastify'
import { getPrisma, ensureDbConnection } from '../../lib/db.js'

export default async function publicClasses(instance: FastifyInstance) {
  instance.get('/classes', async (request, reply) => {
    try {
      await ensureDbConnection()
      const prisma = getPrisma()

      const classes = await prisma.class.findMany({
        where: {
          isActive: true,
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } },
          ],
        },
        include: {
          venue: {
            select: { id: true, name: true, city: true, addressLine1: true, addressLine2: true },
          },
          classInstructors: {
            include: {
              instructor: { include: { user: { select: { fullName: true, email: true } } } },
            },
          },
          classStyles: { include: { style: true } },
          _count: {
            select: {
              bookings: {
                where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
              },
            },
          },
        },
        orderBy: [{ startDate: 'asc' }, { createdAt: 'asc' }],
      })

      const classesWithStudentCount = await Promise.all(
        classes.map(async (cls: any) => {
          let activeLocks = 0
          try {
            const seatLockModel = (prisma as any).seatLock
            if (seatLockModel?.count) {
              activeLocks = await seatLockModel.count({
                where: { itemType: 'CLASS', itemId: cls.id, status: 'ACTIVE', expiresAt: { gt: new Date() } },
              })
            }
          } catch {}
          const bookingsCount = cls?._count?.bookings ?? 0
          return {
            ...cls,
            currentStudents: bookingsCount + activeLocks,
            maxStudents: cls.maxCapacity,
            duration: cls.durationMins,
            schedule: cls.scheduleTime || cls.scheduleDays || 'TBD',
          }
        })
      )

      return { classes: classesWithStudentCount, total: classesWithStudentCount.length }
    } catch (error) {
      request.log?.error(error)
      reply.code(500)
      return { error: 'Failed to fetch classes' }
    }
  })
}
