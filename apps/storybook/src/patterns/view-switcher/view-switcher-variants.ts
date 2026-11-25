import type { ViewSwitcherMenuProps } from '@tc96/ui/patterns'

export type SwitcherVariantName = NonNullable<ViewSwitcherMenuProps['variant']>

export const switcherVariantNames = [
  'default',
  'ghost',
] as const satisfies readonly SwitcherVariantName[]
