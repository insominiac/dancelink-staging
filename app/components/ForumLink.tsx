'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'

interface ForumLinkProps {
  className?: string
  children?: React.ReactNode
}

export default function ForumLink({ className = '', children }: ForumLinkProps) {
  const { t } = useTranslation('common')

  return (
    <Link 
      href="/forum" 
      className={className}
    >
      {children || t('nav.forum')}
    </Link>
  )
}
