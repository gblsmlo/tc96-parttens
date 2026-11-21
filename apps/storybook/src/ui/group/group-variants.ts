import type { Group } from '@tc96/ui/group'
import type { ComponentProps } from 'react'

type GroupProps = ComponentProps<typeof Group>

export type GroupOrientationName = NonNullable<GroupProps['orientation']>

export const groupOrientationNames = [
  'horizontal',
  'vertical',
] as const satisfies readonly GroupOrientationName[]

export const insertActions = ['Image', 'Video', 'Link'] as const
