import { CalendarBlankIcon } from '@phosphor-icons/react'
import { Card1, type Card1Fact } from '@tc96/blocks/application/card/card-1'
import { facts } from '../fixtures/card-1.ts'
import type { Card1Controls } from './card-1-controls.ts'

export const factsWithIcon: Card1Fact[] = [
  ...facts,
  {
    accent: { icon: <CalendarBlankIcon />, kind: 'icon' },
    id: 'review',
    label: 'Próxima revisão',
    value: '15 de dezembro',
  },
]

export const ComposedCard1 = ({ accents, title }: Readonly<Card1Controls>) => (
  <Card1
    facts={
      accents ? factsWithIcon : factsWithIcon.map(({ accent, ...fact }) => fact)
    }
    labels={{ title }}
  />
)
