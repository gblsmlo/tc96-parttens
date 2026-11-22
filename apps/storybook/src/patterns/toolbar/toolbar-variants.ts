import type { ButtonProps } from '@tc96/ui/button'

export const toolbarVariantNames = ['default', 'plain', 'text'] as const

export type ToolbarVariantName = (typeof toolbarVariantNames)[number]

export type SwitcherVariantName = NonNullable<ButtonProps['variant']>

export const switcherVariantNames = [
  'ghost',
  'default',
  'secondary',
  'outline',
  'destructive',
  'destructive-outline',
  'link',
] as const satisfies readonly SwitcherVariantName[]
