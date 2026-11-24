import { Badge } from '@tc96/ui/badge'
import type { CardBadgeData } from './types'

export function CardBadge({
  label,
  tone = 'secondary',
}: Readonly<CardBadgeData>) {
  return <Badge variant={tone}>{label}</Badge>
}
