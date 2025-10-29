import { FastifyInstance } from 'fastify'
import { getPrisma } from '../../lib/db.js'

export default async function adminInstructors(instance: FastifyInstance) {
  // PUT update instructor by id
  instance.put('/:id', async (request, reply) => {
    const prisma = getPrisma()
    const { id } = request.params as any
    const { bio, experience, specialties, certifications, hourlyRate, isAvailable, profileImageUrl } = (request.body || {}) as any

    const existing = await prisma.instructor.findUnique({ where: { id }, include: { user: true } })
    if (!existing) {
      reply.code(404)
      return { error: 'Instructor not found' }
    }

    const userUpdate: any = {}
    if (bio !== undefined) userUpdate.bio = bio
    if (profileImageUrl !== undefined) userUpdate.profileImage = profileImageUrl
    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({ where: { id: existing.userId }, data: userUpdate })
    }

    const instrUpdate: any = {}
    if (specialties !== undefined) instrUpdate.specialty = Array.isArray(specialties) ? specialties.join(', ') : ''
    if (experience !== undefined) instrUpdate.experienceYears = parseInt(String(experience)) || 0
    if (isAvailable !== undefined) instrUpdate.isActive = !!isAvailable

    const instructor = await prisma.instructor.update({
      where: { id },
      data: instrUpdate,
      include: {
        user: { select: { id: true, email: true, fullName: true, role: true, bio: true, profileImage: true } },
      },
    })

    return {
      message: 'Instructor updated successfully',
      instructor: {
        id: instructor.id,
        userId: instructor.userId,
        user: instructor.user,
        bio: instructor.user?.bio || '',
        experience: instructor.experienceYears || 0,
        specialties: instructor.specialty ? instructor.specialty.split(',').map((s: string) => s.trim()) : [],
        certifications: certifications || [],
        hourlyRate: hourlyRate || '50',
        isAvailable: instructor.isActive,
        rating: instructor.rating ? parseFloat(String(instructor.rating)) : 0,
        totalStudents: 0,
        profileImageUrl: instructor.user?.profileImage,
      },
    }
  })

  // DELETE instructor by id
  instance.delete('/:id', async (request, reply) => {
    const prisma = getPrisma()
    const { id } = request.params as any

    const existing = await prisma.instructor.findUnique({ where: { id }, include: { classInstructors: true } })
    if (!existing) {
      reply.code(404)
      return { error: 'Instructor not found' }
    }
    if (existing.classInstructors.length > 0) {
      reply.code(400)
      return { error: 'Cannot delete instructor with active classes. Remove class assignments first.' }
    }

    await prisma.instructor.delete({ where: { id } })
    return { message: 'Instructor deleted successfully' }
  })
}
