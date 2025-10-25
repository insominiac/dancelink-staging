import type { Metadata } from 'next'
import { Dancing_Script } from 'next/font/google'
import './globals.css'
import './styles/dance-theme.css'
import { AuthProvider } from '@/app/lib/auth-context'
import ServiceWorkerProvider from '@/app/components/ServiceWorkerProvider'
import { Toaster } from 'react-hot-toast'
import { cookies, headers } from 'next/headers'
import { SeoProvider } from '@/contexts/SeoContext'

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing',
})

export const metadata: Metadata = {
  title: 'DanceLink - Connect, Learn, Dance',
  description: 'Professional dance platform connecting dancers, instructors, and studios worldwide',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
  },
  other: {
    'msapplication-TileColor': '#ff6b35',
    'msapplication-config': '/browserconfig.xml',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff6b35',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const cookieLang = cookieStore.get('i18next')?.value
  const accept = headers().get('accept-language') || ''
  const acceptLang = accept.split(',')[0]?.split('-')[0]
  const lang = cookieLang || acceptLang || 'en'

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${dancingScript.variable}`} style={{fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
        <ServiceWorkerProvider>
          <AuthProvider>
            <SeoProvider>
              {children}
              <Toaster position="top-right" />
            </SeoProvider>
          </AuthProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  )
}
