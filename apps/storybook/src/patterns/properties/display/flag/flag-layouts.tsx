import { FlagProperty } from '@tc96/parttens'
import { BotIcon, HandIcon } from 'lucide-react'
import type { FlagControls } from './flag-controls.ts'

export const ComposedFlag = ({
  active,
  ariaLabel,
  icon,
  inactiveLabel,
  label,
  showInactive,
  variant,
}: Readonly<FlagControls>) => (
  <FlagProperty
    active={active}
    activeIcon={icon ? BotIcon : undefined}
    ariaLabel={ariaLabel || undefined}
    inactiveIcon={icon ? HandIcon : undefined}
    inactiveLabel={inactiveLabel || undefined}
    label={label}
    showInactive={showInactive}
    variant={variant}
  />
)
