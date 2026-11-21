import type { Toggle } from '@tc96/ui/toggle'
import type { ComponentProps } from 'react'

type ToggleProps = ComponentProps<typeof Toggle>

export type ToggleVariantName = NonNullable<ToggleProps['variant']>

export type ToggleSizeName = NonNullable<ToggleProps['size']>

export const toggleVariantNames = [
  'default',
  'outline',
] as const satisfies readonly ToggleVariantName[]

export const toggleSizeNames = [
  'sm',
  'default',
  'lg',
] as const satisfies readonly ToggleSizeName[]
