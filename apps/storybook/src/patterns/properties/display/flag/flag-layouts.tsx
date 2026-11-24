import { HandIcon, RobotIcon } from '@phosphor-icons/react'
import { FlagProperty } from '@tc96/ui/patterns'
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
    activeIcon={icon ? RobotIcon : undefined}
    ariaLabel={ariaLabel || undefined}
    inactiveIcon={icon ? HandIcon : undefined}
    inactiveLabel={inactiveLabel || undefined}
    label={label}
    showInactive={showInactive}
    variant={variant}
  />
)
