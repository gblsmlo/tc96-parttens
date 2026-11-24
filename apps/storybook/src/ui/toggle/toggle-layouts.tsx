import { TextBIcon } from '@phosphor-icons/react'
import { Toggle, type TogglePrimitive } from '@tc96/ui/toggle'
import type { ToggleControls } from './toggle-controls.ts'

interface ComposedToggleProps extends ToggleControls {
  onPressedChange?: (
    pressed: boolean,
    eventDetails: TogglePrimitive.ChangeEventDetails,
  ) => void
}

export const ComposedToggle = ({
  disabled,
  icon,
  iconOnly,
  label,
  onPressedChange,
  pressed,
  size,
  variant,
}: Readonly<ComposedToggleProps>) => (
  <Toggle
    aria-label={iconOnly ? label : undefined}
    defaultPressed={pressed}
    disabled={disabled}
    key={String(pressed)}
    onPressedChange={onPressedChange}
    size={size}
    variant={variant}
  >
    {icon || iconOnly ? <TextBIcon aria-hidden="true" /> : null}
    {iconOnly ? null : label}
  </Toggle>
)
