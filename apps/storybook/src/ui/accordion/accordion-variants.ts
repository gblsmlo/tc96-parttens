import {
  GearIcon,
  type Icon as PhosphorIcon,
  StackIcon,
  UserIcon,
} from '@phosphor-icons/react'

export const accordionItems = [
  {
    content: 'Describe what the first panel reveals here.',
    icon: StackIcon,
    value: 'first',
  },
  {
    content: 'Describe what the second panel reveals here.',
    icon: UserIcon,
    value: 'second',
  },
  {
    content: 'Describe what the third panel reveals here.',
    icon: GearIcon,
    value: 'third',
  },
] as const satisfies readonly {
  content: string
  icon: PhosphorIcon
  value: string
}[]

export type AccordionItemValue = (typeof accordionItems)[number]['value']

export const accordionOpenItems = ['none', 'first', 'second', 'third'] as const

export type AccordionOpenItem = (typeof accordionOpenItems)[number]

export const disabledItemValue: AccordionItemValue = 'third'
