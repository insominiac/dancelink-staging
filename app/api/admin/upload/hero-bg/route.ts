import { NextRequest, NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'

export const runtime = 'edge'

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const maxSize = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({
        error: 'Blob storage token not configured. Set BLOB_READ_WRITE_TOKEN.'
      }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'
      }, { status: 400 })
    }

    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 })
    }

    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'png'
    const key = `uploads/hero-backgrounds/hero-bg-${Date.now()}.${ext}`

    const { url } = await put(key, file.stream(), {
      access: 'public',
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({
      success: true,
      message: 'Hero background image uploaded successfully',
      url,
      filename: key.split('/').pop(),
    })
  } catch (error) {
    console.error('Error uploading hero background:', error)
    return NextResponse.json({
      error: 'Failed to upload hero background image'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: 'No url provided' }, { status: 400 })
    }

    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN })

    return NextResponse.json({
      success: true,
      message: 'Hero background image deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting hero background:', error)
    return NextResponse.json({
      error: 'Failed to delete hero background image'
    }, { status: 500 })
  }
}
