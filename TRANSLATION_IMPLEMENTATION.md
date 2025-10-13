# SSR Translation Implementation Guide

## 1. Install next-intl (Recommended for App Router)

```bash
npm install next-intl
```

## 2. Configure i18n

### Create i18n config file
```typescript
// app/i18n.ts
import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));
```

### Update next.config.js
```javascript
// next.config.js
const withNextIntl = require('next-intl/plugin')('./app/i18n.ts');

module.exports = withNextIntl({
  // Your existing config
});
```

### Create middleware for locale detection
```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['en', 'es', 'fr', 'de'],
  defaultLocale: 'en'
});
 
export const config = {
  matcher: ['/', '/(en|es|fr|de)/:path*']
};
```

## 3. Static Text Translations

### Create message files
```json
// app/messages/en.json
{
  "navigation": {
    "home": "Home",
    "classes": "Classes",
    "events": "Events",
    "about": "About"
  },
  "classes": {
    "title": "Dance Classes",
    "book_now": "Book Now",
    "view_details": "View Details",
    "price": "Price: ${price}",
    "duration": "{duration} minutes"
  }
}

// app/messages/es.json
{
  "navigation": {
    "home": "Inicio",
    "classes": "Clases",
    "events": "Eventos",
    "about": "Acerca de"
  },
  "classes": {
    "title": "Clases de Baile",
    "book_now": "Reservar Ahora",
    "view_details": "Ver Detalles",
    "price": "Precio: ${price}",
    "duration": "{duration} minutos"
  }
}
```

### Use in Server Components
```tsx
// app/[locale]/classes/page.tsx
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';

export default async function ClassesPage({params: {locale}}) {
  // Server-side translation
  const t = await getTranslations('classes');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('book_now')}</button>
    </div>
  );
}
```

## 4. Database Content Translations

### Option A: Separate Translation Tables

```sql
-- Update your Prisma schema
model Class {
  id            Int                 @id @default(autoincrement())
  // ... existing fields
  translations  ClassTranslation[]
}

model ClassTranslation {
  id          Int     @id @default(autoincrement())
  classId     Int
  locale      String
  name        String
  description String?
  class       Class   @relation(fields: [classId], references: [id], onDelete: Cascade)
  
  @@unique([classId, locale])
  @@index([locale])
}

model EventTranslation {
  id          Int     @id @default(autoincrement())
  eventId     Int
  locale      String
  name        String
  description String?
  event       Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  @@unique([eventId, locale])
  @@index([locale])
}
```

### Option B: JSON Columns for Translations

```sql
model Class {
  id            Int      @id @default(autoincrement())
  name          Json     // {"en": "Ballet", "es": "Ballet", "fr": "Ballet"}
  description   Json     // {"en": "Classic ballet...", "es": "Ballet clásico..."}
  // ... other fields
}
```

## 5. API Implementation with Translations

```typescript
// app/api/admin/classes/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/app/lib/db';

export async function GET(request: NextRequest) {
  const locale = request.headers.get('accept-language')?.split(',')[0] || 'en';
  
  // Option A: With translation tables
  const classes = await prisma.class.findMany({
    include: {
      translations: {
        where: { locale },
        select: { name: true, description: true }
      }
    }
  });
  
  // Transform data to include translation
  const translatedClasses = classes.map(cls => ({
    ...cls,
    name: cls.translations[0]?.name || cls.name,
    description: cls.translations[0]?.description || cls.description
  }));
  
  return Response.json(translatedClasses);
}

// For JSON columns (Option B)
export async function GET_JSON(request: NextRequest) {
  const locale = request.headers.get('accept-language')?.split(',')[0] || 'en';
  
  const classes = await prisma.class.findMany();
  
  // Extract translation from JSON
  const translatedClasses = classes.map(cls => ({
    ...cls,
    name: cls.name[locale] || cls.name['en'],
    description: cls.description[locale] || cls.description['en']
  }));
  
  return Response.json(translatedClasses);
}
```

## 6. Complete Page Example with SSR

```tsx
// app/[locale]/classes/page.tsx
import { getTranslations } from 'next-intl/server';
import prisma from '@/app/lib/db';

interface PageProps {
  params: { locale: string };
}

export default async function ClassesPage({ params: { locale } }: PageProps) {
  // Static translations
  const t = await getTranslations('classes');
  
  // Fetch classes with translations from DB
  const classes = await prisma.class.findMany({
    include: {
      translations: {
        where: { locale },
        select: { name: true, description: true }
      },
      instructor: true,
      venue: true
    }
  });
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((class) => {
          // Use translation if available, fallback to default
          const name = class.translations[0]?.name || class.name;
          const description = class.translations[0]?.description || class.description;
          
          return (
            <div key={class.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-gray-600">{description}</p>
              <p className="mt-2">{t('price', { price: class.price })}</p>
              <p>{t('duration', { duration: class.duration })}</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                {t('book_now')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Generate static params for all locales
export async function generateStaticParams() {
  return ['en', 'es', 'fr', 'de'].map((locale) => ({ locale }));
}
```

## 7. Admin Panel for Managing Translations

```tsx
// app/admin/sections/ClassTranslations.tsx
'use client';

import { useState } from 'react';

interface TranslationForm {
  locale: string;
  name: string;
  description: string;
}

export default function ClassTranslations({ classId }: { classId: number }) {
  const [translations, setTranslations] = useState<TranslationForm[]>([
    { locale: 'en', name: '', description: '' },
    { locale: 'es', name: '', description: '' },
    { locale: 'fr', name: '', description: '' },
    { locale: 'de', name: '', description: '' }
  ]);
  
  const handleSave = async () => {
    const response = await fetch(`/api/admin/classes/${classId}/translations`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(translations)
    });
    
    if (response.ok) {
      alert('Translations saved!');
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Translations</h3>
      {translations.map((trans, index) => (
        <div key={trans.locale} className="border p-3 rounded">
          <h4 className="font-medium">{trans.locale.toUpperCase()}</h4>
          <input
            type="text"
            placeholder="Name"
            value={trans.name}
            onChange={(e) => {
              const newTrans = [...translations];
              newTrans[index].name = e.target.value;
              setTranslations(newTrans);
            }}
            className="w-full mt-2 p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={trans.description}
            onChange={(e) => {
              const newTrans = [...translations];
              newTrans[index].description = e.target.value;
              setTranslations(newTrans);
            }}
            className="w-full mt-2 p-2 border rounded"
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Translations
      </button>
    </div>
  );
}
```

## 8. Language Switcher Component

```tsx
// app/components/LanguageSwitcher.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];
  
  const handleChange = (newLocale: string) => {
    // Replace the locale in the current path
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };
  
  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="border rounded px-2 py-1"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
```

## 9. Update Layout for Locale Support

```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <header className="p-4 border-b">
            <div className="container mx-auto flex justify-between">
              <nav>{/* Your navigation */}</nav>
              <LanguageSwitcher />
            </div>
          </header>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## Performance Benefits of SSR Translations

1. **SEO Optimization**: Each language version is fully rendered server-side
2. **No Flash of Untranslated Content**: Users see translated content immediately
3. **Better Initial Load**: No need to fetch translations client-side
4. **Crawlable Content**: Search engines can index all language versions

## Migration Steps for Your Project

1. Install next-intl
2. Update Prisma schema with translation tables
3. Run migrations
4. Create translation message files
5. Update existing pages to use locale parameter
6. Add language switcher to layout
7. Update admin panel to manage translations
8. Configure middleware for locale detection

## Alternative: Using Translation API

For real-time translation without storing in DB:

```typescript
// app/api/translate/route.ts
import { translate } from '@google-cloud/translate';

export async function POST(request: Request) {
  const { text, targetLang } = await request.json();
  
  // Cache translations in Redis (from your environment vars)
  const cacheKey = `translation:${targetLang}:${text}`;
  
  // Check cache first
  // If not cached, translate and store
  const translation = await translate(text, targetLang);
  
  return Response.json({ translation });
}
```

This approach works but adds latency and costs for API calls.