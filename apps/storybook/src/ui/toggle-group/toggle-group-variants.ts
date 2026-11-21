import type { ToggleGroup } from '@tc96/ui/toggle-group'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  type LucideIcon,
} from 'lucide-react'
import type { ComponentProps } from 'react'

type ToggleGroupProps = ComponentProps<typeof ToggleGroup>

export type ToggleGroupVariantName = NonNullable<ToggleGroupProps['variant']>

export type ToggleGroupSizeName = NonNullable<ToggleGroupProps['size']>

export type ToggleGroupOrientationName = NonNullable<
  ToggleGroupProps['orientation']
>

export const toggleGroupVariantNames = [
  'default',
  'outline',
] as const satisfies readonly ToggleGroupVariantName[]

export const toggleGroupSizeNames = [
  'sm',
  'default',
  'lg',
] as const satisfies readonly ToggleGroupSizeName[]

export const toggleGroupOrientationNames = [
  'horizontal',
  'vertical',
] as const satisfies readonly ToggleGroupOrientationName[]

export interface AlignmentOption {
  icon: LucideIcon
  label: string
  value: string
}

export const alignments: readonly AlignmentOption[] = [
  { icon: AlignLeftIcon, label: 'Left', value: 'left' },
  { icon: AlignCenterIcon, label: 'Center', value: 'center' },
  { icon: AlignRightIcon, label: 'Right', value: 'right' },
]

export const disabledAlignment = 'center'
