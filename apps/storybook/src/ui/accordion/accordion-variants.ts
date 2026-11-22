import {
  LayersIcon,
  type LucideIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react'

export const accordionItems = [
  {
    content: 'Describe what the first panel reveals here.',
    icon: LayersIcon,
    value: 'first',
  },
  {
    content: 'Describe what the second panel reveals here.',
    icon: UserIcon,
    value: 'second',
  },
  {
    content: 'Describe what the third panel reveals here.',
    icon: SettingsIcon,
    value: 'third',
  },
] as const satisfies readonly {
  content: string
  icon: LucideIcon
  value: string
}[]

export type AccordionItemValue = (typeof accordionItems)[number]['value']

export const accordionOpenItems = ['none', 'first', 'second', 'third'] as const

export type AccordionOpenItem = (typeof accordionOpenItems)[number]

export const disabledItemValue: AccordionItemValue = 'third'
