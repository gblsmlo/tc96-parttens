import type { ButtonProps } from '@tc96/ui/button'
import type { CollectionToolbarMode } from '@tc96/ui/patterns'

export const toolbarModeNames = [
  'default',
  'plain',
] as const satisfies readonly CollectionToolbarMode[]

export type ToolbarModeName = (typeof toolbarModeNames)[number]

export const leftContents = ['switcher', 'heading', 'search', 'none'] as const

export type LeftContent = (typeof leftContents)[number]

export const centerContents = ['none', 'search'] as const

export type CenterContent = (typeof centerContents)[number]

export const rightContents = [
  'settings-and-action',
  'settings',
  'action',
  'none',
] as const

export type RightContent = (typeof rightContents)[number]

export type SwitcherVariantName = NonNullable<ButtonProps['variant']>
