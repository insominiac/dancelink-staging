export function generateMetadata(path: string, seoData?: any) {
  if (!seoData) {
    return {
      title: 'DanceLink - Connect, Learn, Dance',
      description: 'Professional dance classes and events platform'
    }
  }

  const title = seoData.title || seoData.ogTitle || 'DanceLink - Connect, Learn, Dance'
  const description = seoData.description || seoData.ogDescription || 'Professional dance classes and events platform'
  const images = seoData.ogImage ? [{ url: seoData.ogImage }] : []

  let other: Record<string, string> | undefined
  try {
    if (seoData.customMeta) {
      const arr = typeof seoData.customMeta === 'string' ? JSON.parse(seoData.customMeta) : seoData.customMeta
      other = arr.reduce((acc: any, meta: any) => {
        if (meta?.name && meta?.content) acc[meta.name] = meta.content
        return acc
      }, {})
    }
  } catch {}

  return {
    title,
    description,
    keywords: seoData.keywords,
    authors: seoData.author ? [{ name: seoData.author }] : undefined,
    robots: seoData.robots || 'index,follow',
    // canonical is not a standard Metadata field; include via other if needed
    alternates: seoData.canonical ? { canonical: seoData.canonical } : undefined,
    openGraph: {
      title: seoData.ogTitle || title,
      description: seoData.ogDescription || description,
      type: seoData.ogType || 'website',
      url: seoData.ogUrl,
      images,
      siteName: 'DanceLink - Connect, Learn, Dance'
    },
    twitter: {
      card: seoData.twitterCard || 'summary_large_image',
      title: seoData.twitterTitle || seoData.ogTitle || title,
      description: seoData.twitterDescription || seoData.ogDescription || description,
      images: seoData.twitterImage ? [seoData.twitterImage] : images.map((img: any) => img.url),
      creator: seoData.twitterCreator
    },
    other
  }
}
