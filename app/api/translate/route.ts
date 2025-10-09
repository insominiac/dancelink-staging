import { NextRequest, NextResponse } from 'next/server'
import { translationService } from '@/lib/translation-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { texts, target = 'en', source = 'en' } = body || {}

    if (!Array.isArray(texts)) {
      return NextResponse.json({ error: 'texts must be an array' }, { status: 400 })
    }

    const translations = await translationService.translateBatch(texts, target, source)
    return NextResponse.json({ translations })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json({ error: 'Failed to translate' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
