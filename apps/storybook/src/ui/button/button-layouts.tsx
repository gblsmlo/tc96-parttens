import { Button } from '@tc96/ui/button'
import { ChevronDownIcon, PlusIcon } from 'lucide-react'
import type { ButtonControls } from './button-controls.ts'
import { isIconSize } from './button-variants.ts'

export const ComposedButton = ({
  disabled,
  icon,
  label,
  loading,
  size,
  variant,
}: Readonly<ButtonControls>) => {
  const iconOnly = isIconSize(size)
  return (
    <Button
      aria-label={iconOnly ? label : undefined}
      disabled={disabled}
      loading={loading}
      size={size}
      variant={variant}
    >
      {icon || iconOnly ? <PlusIcon aria-hidden="true" /> : null}
      {iconOnly ? null : label}
    </Button>
  )
}

export const LeadingIconButton = () => (
  <Button>
    <PlusIcon aria-hidden="true" />
    Create
  </Button>
)

export const TrailingIconButton = () => (
  <Button>
    Create
    <ChevronDownIcon aria-hidden="true" />
  </Button>
)

export const LinkElementButton = () => (
  <Button render={(props) => <a {...props} href="#create" />}>Create</Button>
)
