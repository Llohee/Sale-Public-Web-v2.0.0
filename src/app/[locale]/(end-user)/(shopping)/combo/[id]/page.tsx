import { ComboDetailPageClient } from '@/components/combo/detail'
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Combo ${id}`,
    description: '',
  }
}

export default async function ComboDetailPage({ params }: Props) {
  const { id } = await params
  return <ComboDetailPageClient comboId={id} />
}
