import { NextRequest, NextResponse } from 'next/server'
import prisma, { ensureDbConnection } from '@/app/lib/db'
import { resolveLocale } from '@/app/lib/locale'
import { translationService } from '@/lib/translation-service'

export async function GET(request: NextRequest) {
  try {
    await ensureDbConnection()
    const locale = resolveLocale(request, 'en')
    const danceStyles = await prisma.danceStyle.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        category: true,
        icon: true,
        subtitle: true,
        description: true,
        difficulty: true,
        origin: true,
        musicStyle: true,
        characteristics: true,
        benefits: true,
        schedule: true,
        price: true,
        instructors: true,
        image: true,
        videoUrl: true,
        isFeatured: true,
        sortOrder: true,
        _count: {
          select: {
            classStyles: true,
            eventStyles: true,
            userStyles: true
          }
        }
      },
      orderBy: [
        {
          sortOrder: 'asc'
        },
        {
          isFeatured: 'desc'
        },
        {
          classStyles: {
            _count: 'desc'
          }
        },
        {
          name: 'asc'
        }
      ]
    })

    // Transform the data to include parsed JSON fields
    let enhancedDanceStyles = danceStyles.map(style => {
      // Parse JSON fields
      const parseJsonField = (field: string | null) => {
        if (!field) return []
        try {
          return JSON.parse(field)
        } catch {
          return [field]
        }
      }
      
      return {
        id: style.id,
        name: style.name,
        category: style.category || 'Latin',
        classCount: style._count.classStyles,
        eventCount: style._count.eventStyles,
        studentCount: style._count.userStyles,
        totalCount: style._count.classStyles + style._count.eventStyles,
        icon: style.icon || '💃',
        subtitle: style.subtitle || 'Discover this amazing dance style',
        description: style.description || `Learn the beautiful art of ${style.name} with our experienced instructors.`,
        difficulty: style.difficulty || 'All Levels',
        origin: style.origin || 'Traditional',
        musicStyle: style.musicStyle || 'Various',
        characteristics: parseJsonField(style.characteristics),
        benefits: parseJsonField(style.benefits),
        schedule: parseJsonField(style.schedule),
        price: style.price || 'Contact for pricing',
        instructors: style.instructors || 'Professional instructors',
        image: style.image,
        videoUrl: style.videoUrl,
        isFeatured: style.isFeatured,
        sortOrder: style.sortOrder
      }
    })

    // Server-side translation when locale != en
    if (locale && locale !== 'en') {
      // Collect all strings to batch translate
      const texts: string[] = []
      const positions: { idx: number, key: string, type?: 'array', arrKey?: string }[] = []
      enhancedDanceStyles.forEach((s, idx) => {
        const pushOne = (key: string, val?: string | null) => {
          if (val) { texts.push(val); positions.push({ idx, key }) }
        }
        pushOne('name', s.name)
        pushOne('category', s.category)
        pushOne('subtitle', s.subtitle)
        pushOne('description', s.description)
        pushOne('difficulty', s.difficulty)
        pushOne('origin', s.origin)
        pushOne('musicStyle', s.musicStyle)
        pushOne('price', s.price)
        pushOne('instructors', s.instructors)
        // Arrays: characteristics, benefits, schedule
        ;(['characteristics','benefits','schedule'] as const).forEach(arrKey => {
          const arr = (s as any)[arrKey] as string[] | undefined
          if (Array.isArray(arr)) {
            arr.forEach(() => positions.push({ idx, key: arrKey, type: 'array', arrKey }))
            texts.push(...arr)
          }
        })
      })
      if (texts.length) {
        const translated = await translationService.translateBatch(texts, locale, 'en')
        let p = 0
        enhancedDanceStyles = enhancedDanceStyles.map((s, idx) => {
          const out: any = { ...s }
          positions.forEach(pos => {
            if (pos.idx !== idx) return
            const val = translated[p++]
            if (pos.type === 'array' && pos.arrKey) {
              const arr = out[pos.arrKey] as string[]
              if (Array.isArray(arr)) {
                // We rebuild arrays sequentially: simpler approach
                // Count how many entries belong to this array
              }
            } else {
              if (pos.key in out) out[pos.key] = val
            }
          })
          return out
        })
        // Second pass to rebuild arrays accurately
        // We'll re-walk and rebuild arrays for each style
        let q = 0
        enhancedDanceStyles = enhancedDanceStyles.map((s, idx) => {
          const out: any = { ...s }
          ;(['characteristics','benefits','schedule'] as const).forEach(arrKey => {
            const original = (danceStyles[idx] as any)[arrKey] as string[] | undefined
            if (Array.isArray(original)) {
              const translatedArr: string[] = []
              for (let i = 0; i < original.length; i++) {
                translatedArr.push(translated[q++])
              }
              out[arrKey] = translatedArr
            }
          })
          return out
        })
      }
    }

    // Group styles by category for better organization
    const stylesByCategory = enhancedDanceStyles.reduce((acc, style) => {
      const category = style.category || 'Other'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(style)
      return acc
    }, {} as Record<string, typeof enhancedDanceStyles>)

    return NextResponse.json({
      success: true,
      data: {
        styles: enhancedDanceStyles,
        stylesByCategory,
        totalStyles: enhancedDanceStyles.length,
        totalClasses: enhancedDanceStyles.reduce((sum, style) => sum + style.classCount, 0),
        totalEvents: enhancedDanceStyles.reduce((sum, style) => sum + style.eventCount, 0)
      }
    })
  } catch (error) {
    console.error('Error fetching dance styles:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dance styles'
    }, { status: 500 })
  }
}

