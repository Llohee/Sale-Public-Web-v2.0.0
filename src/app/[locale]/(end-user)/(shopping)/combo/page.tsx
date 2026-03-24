import { ComboWrapper } from '@/components/combo'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('layout')
  return {
    title: t('header.combo') ?? 'Combo',
    description: 'Combo offers',
  }
}

export default function ComboPage() {
  return <ComboWrapper />
}
