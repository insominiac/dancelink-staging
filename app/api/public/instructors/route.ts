import { NextRequest, NextResponse } from 'next/server'
import db from '../../../lib/db'
import { resolveLocale } from '@/app/lib/locale'
import { translationService } from '@/lib/translation-service'

// Enable ISR with 30 minute revalidation
export const revalidate = 1800 // 30 minutes

export async function GET(request: NextRequest) {
  try {
    const locale = resolveLocale(request, 'en')
    const instructors = await db.instructor.findMany({
      where: {
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            bio: true,
            profileImage: true,
            instagramHandle: true,
            websiteUrl: true
          }
        },
        classInstructors: {
          include: {
            class: {
              select: {
                id: true,
                title: true,
                level: true,
                status: true
              }
            }
          }
        },
        _count: {
          select: {
            classInstructors: {
              where: {
                class: {
                  status: 'PUBLISHED'
                }
              }
            }
          }
        }
      },
      orderBy: [
        { classInstructors: { _count: 'desc' } }, // Most active instructors first
        { user: { fullName: 'asc' } }
      ]
    })

    const instructorsWithDetails = instructors.map(instructor => ({
      id: instructor.id,
      userId: instructor.userId,
      name: instructor.user.fullName,
      bio: instructor.user.bio,
      specialty: instructor.specialty,
      experienceYears: instructor.experienceYears,
      rating: instructor.rating,
      imageUrl: instructor.user.profileImage,
      email: instructor.user.email,
      phone: instructor.user.phone,
      instagramHandle: instructor.user.instagramHandle,
      websiteUrl: instructor.user.websiteUrl,
      isActive: instructor.isActive,
      createdAt: instructor.createdAt,
      activeClasses: instructor.classInstructors
        .filter(ci => ci.class.status === 'PUBLISHED')
        .map(ci => ({
          id: ci.class.id,
          title: ci.class.title,
          level: ci.class.level,
          isPrimary: ci.isPrimary
        })),
      classCount: instructor._count.classInstructors,
      // Extract specialties as array if stored as JSON or comma-separated
      specialtiesArray: instructor.specialty 
        ? (typeof instructor.specialty === 'string' 
            ? instructor.specialty.split(',').map(s => s.trim())
            : [instructor.specialty])
        : []
    }))

    // Server-side translation for dynamic fields
    let translatedInstructors = instructorsWithDetails
    if (locale && locale !== 'en') {
      const texts: string[] = []
      const positions: { idx: number, key: 'bio'|'specialty'|'title', classIdx?: number }[] = []
      
      instructorsWithDetails.forEach((instructor, idx) => {
        if (instructor.bio) { 
          texts.push(instructor.bio)
          positions.push({ idx, key: 'bio' })
        }
        if (instructor.specialty) { 
          texts.push(instructor.specialty)
          positions.push({ idx, key: 'specialty' })
        }
        instructor.activeClasses.forEach((cls, classIdx) => {
          if (cls.title) {
            texts.push(cls.title)
            positions.push({ idx, key: 'title', classIdx })
          }
        })
      })
      
      if (texts.length) {
        const translated = await translationService.translateBatch(texts, locale, 'en')
        let p = 0
        translatedInstructors = instructorsWithDetails.map((instructor, idx) => {
          const clone: any = { 
            ...instructor, 
            activeClasses: instructor.activeClasses.map(cls => ({ ...cls }))
          }
          
          positions.forEach(pos => {
            if (pos.idx === idx) {
              const val = translated[p++]
              if (pos.key === 'bio') clone.bio = val
              else if (pos.key === 'specialty') clone.specialty = val
              else if (pos.key === 'title' && pos.classIdx !== undefined) {
                clone.activeClasses[pos.classIdx].title = val
              }
            }
          })
          return clone
        })
      }
    }

    return NextResponse.json({
      instructors: translatedInstructors,
      total: translatedInstructors.length,
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching instructors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    )
  }
}